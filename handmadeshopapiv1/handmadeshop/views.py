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


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer

    @action(methods=['post'], url_path='products', detail=False)
    def post_product(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='products', detail=True)
    def edit_product(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['delete'], url_path='products', detail=True)
    def delete_product(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({"detail": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], url_path='get-products', detail=False)
    def get_products(self, request):
        products = Product.objects.all()
        serializer = self.serializer_class(products, many=True)
        return Response(serializer.data)


class WishlistViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = serializers.WishlistSerializer

    def get_permissions(self):
        if self.action in ['add_product','remove_product']:
            return [permissions.IsAdminUser()]

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