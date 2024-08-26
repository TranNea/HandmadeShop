from django.shortcuts import render
from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from handmadeshop import serializers
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


class BlogViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = serializers.BlogSerializer


class BlogCommentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = BlogComment.objects.all()
    serializer_class = serializers.BlogCommentSerializer

    @action(methods=['post'], url_path='comments', detail=False)
    def post_blogcomment(self, request):
        blog_id = request.data.get('blog_id')

        try:
            blog = Blog.objects.get(pk=blog_id)
        except Blog.DoesNotExist:
            return Response({"detail": "Blog not found."}, status=status.HTTP_404_NOT_FOUND)

        blogcomment = BlogComment.objects.create(
            blog=blog,
            user=request.user,
            comment=request.data.get('comment')
        )

        return Response(serializers.BlogCommentSerializer(blogcomment).data, status=status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer

    def get_queryset(self):
        queryset = self.queryset

        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)
        return queryset

        cate_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=cate_id)
        return queryset


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


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