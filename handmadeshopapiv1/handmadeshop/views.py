from django.contrib.admin.templatetags.admin_list import pagination
from django.shortcuts import render
from django.template.defaulttags import comment
from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from handmadeshop import serializers, paginators, perms
from handmadeshop.models import *

# Create your views here.
class UserViewSet(viewsets.ViewSet,generics.CreateAPIView,generics.ListAPIView,generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser,]

    def get_permissions(self):
        if self.action in ['delete_user']:
            return [permissions.IsAdminUser()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

    @action(methods=['delete'], url_path='delete-user', detail=True)
    def delete_user(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except User.DoesNotExist:
            return Response({"detail": "No User matches the given query."}, status=status.HTTP_404_NOT_FOUND)
        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class BlogViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = serializers.BlogSerializer

    @action(methods=['get'], url_path='comments', detail=True)
    def get_blogcomment(self, request, pk):
        blogcomments = self.get_object().blogcomment_set.select_related('user').order_by('-id')
        return Response(serializers.BlogCommentSerializer(blogcomments, many=True).data)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_blogcomment(self, request, pk):
        c = self.get_object().blogcomment_set.create(comment=request.data.get('comment'), user=request.user)
        return Response(serializers.BlogCommentSerializer(c).data, status=status.HTTP_201_CREATED)


class BlogCommentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = BlogComment.objects.all()
    serializer_class = serializers.BlogCommentSerializer


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer
    pagination_class = paginators.ProductPaginator

    def get_queryset(self):
        queryset = self.queryset

        q = self.request.query_params.get('q')
        cate_id = self.request.query_params.get('category_id')
        product_status = self.request.query_params.get('status')

        if q:
            queryset = queryset.filter(name__icontains=q)
        if cate_id:
            queryset = queryset.filter(category_id=cate_id)
        if product_status:
            queryset = queryset.filter(status=product_status)
        return queryset

    @action(methods=['get'], url_path='comments', detail=True)
    def get_productcomment(self, request, pk):
        productcomments = self.get_object().productcomment_set.select_related('user').order_by('-id')
        return Response(serializers.ProductCommentSerializer(productcomments, many=True).data)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_productcomment(self, request, pk):
        c = self.get_object().productcomment_set.create(description=request.data.get('description'), user=request.user)
        return Response(serializers.ProductCommentSerializer(c).data, status=status.HTTP_201_CREATED)

class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer

    @action(methods=['get'], url_path='products', detail=True)
    def get_products(self, request, pk):
        category_id = Category.objects.get(pk=pk)
        products = Product.objects.filter(category=category_id)
        return Response(serializers.ProductSerializer(products, many=True).data, status=status.HTTP_200_OK)


class WishlistViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = serializers.WishlistSerializer

    def get_permissions(self):
        if self.action in ['add_product','remove_product']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='products', detail=False)
    def add_product(self, request):
        product_id = request.data.get('product_id')
        product = Product.objects.filter(id=product_id).first()

        if not product:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        wishlist_product = Wishlist.objects.filter(user=request.user, product=product)

        if wishlist_product.exists():
            wishlist_product.delete()
            return Response({"detail": "Product has existed."}, status=status.HTTP_204_NO_CONTENT)
        else:
            Wishlist.objects.create(user=request.user, product=product)
            return Response({"detail": "Product added to wishlist."}, status=status.HTTP_201_CREATED)

    @action(methods=['delete'], url_path='products', detail=True)
    def remove_product(self, request, pk=None):
        try:
            wishlist_product = Wishlist.objects.get(pk=pk)
        except Wishlist.DoesNotExist:
            return Response({"detail": "Product not found in wishlist."}, status=status.HTTP_404_NOT_FOUND)

        wishlist_product.delete()
        return Response({"detail": "Product removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)


