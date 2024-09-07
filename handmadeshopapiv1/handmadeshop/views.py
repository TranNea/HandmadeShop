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
        if self.action == 'delete_user':
            return [permissions.IsAdminUser()]
        if self.action in ['retrieve', 'get_current_user']:
            return [permissions.IsAuthenticated()]
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
    pagination_class = paginators.BlogPaginator

    @action(methods=['get'], url_path='blogcomments', detail=True)
    def get_blogcomment(self, request, pk):
        blogcomments = self.get_object().blogcomment_set.select_related('user').order_by('-id')

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(blogcomments, request)
        if page is not None:
            serializer = serializers.BlogCommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.BlogCommentSerializer(blogcomments, many=True).data)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_blogcomment(self, request, pk):
        c = self.get_object().blogcomment_set.create(content=request.data.get('content'), user=request.user)
        return Response(serializers.BlogCommentSerializer(c).data, status=status.HTTP_201_CREATED)


class BlogCommentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = BlogComment.objects.all()
    serializer_class = serializers.BlogCommentSerializer
    permission_classes = [perms.CommentOwner]


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer
    pagination_class = paginators.ProductPaginator

    def get_permissions(self):
        if self.action in ['add_to_wishlist']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

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

    @action(methods=['get'], url_path='productcomments', detail=True)
    def get_productcomment(self, request, pk):
        productcomments = self.get_object().productcomment_set.select_related('user').order_by('-id')

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(productcomments, request)
        if page is not None:
            serializer = serializers.ProductCommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.ProductCommentSerializer(productcomments, many=True).data)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_productcomment(self, request, pk):
        c = self.get_object().productcomment_set.create(description=request.data.get('description'), user=request.user)
        return Response(serializers.ProductCommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='wishlists', detail=True)
    def add_to_wishlist(self, request, pk):
        product = self.get_object()
        wishlist_product = Wishlist.objects.filter(user=request.user, product=product)

        if wishlist_product.exists():
            return Response({"detail": "Product already in wishlist."}, status=status.HTTP_200_OK)

        Wishlist.objects.create(user=request.user, product=product)
        return Response({"detail": "Product added to wishlist."}, status=status.HTTP_201_CREATED)

    @action(methods=['delete'], url_path='remove-wishlist', detail=True)
    def remove_from_wishlist(self, request, pk):
        product = self.get_object()
        wishlist_product = Wishlist.objects.filter(user=request.user, product=product).first()

        if not wishlist_product:
            return Response({"detail": "Product not found in wishlist."}, status=status.HTTP_404_NOT_FOUND)

        wishlist_product.delete()
        return Response({"detail": "Product removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)


class ProductCommentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = ProductComment.objects.all()
    serializer_class = serializers.ProductCommentSerializer
    permission_classes = [perms.CommentOwner]


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer

    @action(methods=['get'], url_path='products', detail=True)
    def get_products(self, request, pk):
        category_id = Category.objects.get(pk=pk)
        products = Product.objects.filter(category=category_id)
        return Response(serializers.ProductSerializer(products, many=True).data, status=status.HTTP_200_OK)


class WishlistViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = serializers.WishlistSerializer
    permission_classes = [perms.WishlistOwner]

    def get_queryset(self):
        user = self.request.user
        return Wishlist.objects.filter(user=user)


class CartViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Cart.objects.all()
    serializer_class = serializers.CartSerializer
    permission_classes = [perms.CartOwner]

    def get_cart_items(self):
        cart = Cart.objects.get(user=self.request.user)
        items = Item.objects.filter(cart=cart)
        return items

    @action(methods=['post'], url_path='items', detail=False)
    def add_items(self, request):
        cart = Cart.objects.get(user=self.request.user)
        product_id = request.data.get('product_id')
        product = Product.objects.filter(id=product_id).first()

        if not product:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity', 1)
        item, created = Item.objects.get_or_create(cart=cart, product=product, defaults={
            'quantity': quantity
        })

        if not created:
            item.quantity += int(quantity)
            item.save()
            return Response({"detail": "Item quantity updated in cart."}, status=status.HTTP_200_OK)

        return Response({"detail": "Item added to cart."}, status=status.HTTP_201_CREATED)

    @action(methods=['delete'], url_path='cartitems', detail=False)
    def delete_cartitems(self, request):
        product_id = request.data.get('product_id')

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        cart = Cart.objects.get(user=self.request.user)
        item = Item.objects.filter(cart=cart, product=product).first()

        if item:
            item.delete()
            return Response({"detail": "Item removed from cart."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = serializers.OrderSerializer
    permission_classes = [perms.CartOwner]

    def get_items(self):
        cart = Cart.objects.filter(user=self.request.user).first()
        return cart.items.all() if cart else []

    @action(methods=['post'], url_path='orders', detail=False)
    def create_order(self, request):
        user = request.user
        payment_method = request.data.get('payment_method', 'C')
        shipping_address = request.data.get('shipping_address', '539 Hương Lộ 3, Sơn Kỳ, Tân Phú, TP. Hồ Chí Minh')
        voucher_code = request.data.get('voucher_code')

        voucher = None
        if voucher_code:
            try:
                voucher = Voucher.objects.get(code=voucher_code)
            except Voucher.DoesNotExist:
                return Response({"detail": "Invalid voucher code."}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=user,
            payment_method=payment_method,
            shipping_address=shipping_address,
            voucher=voucher
        )

        cart_items = self.get_items()
        for item in cart_items:
            item.order = order
            item.cart = None
            item.save()

        Cart.objects.filter(user=user).update(items=None)

        return Response(serializers.OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(methods=['patch'], url_path='cancelorders', detail=True)
    def cancel_order(self, request, pk=None):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status in ['D', 'R']:
            return Response({"detail": "Cannot cancel a delivered or returned order."},
                            status=status.HTTP_400_BAD_REQUEST)

        order.status = 'C'
        order.save()

        return Response(serializers.OrderSerializer(order).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='userorders', detail=False)
    def all_user_orders(self, request):
        user = request.user
        orders = Order.objects.filter(user=user)

        if not orders.exists():
            return Response({"detail": "Orders not found."},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VoucherViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Voucher.objects.all()
    serializer_class = serializers.VoucherSerializer


class RefundViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Refund.objects.all()
    serializer_class = serializers.RefundSerializer

    @action(methods=['post'], url_path='refunds', detail=False)
    def create_refund(self, request):
        order_id = request.data.get('order_id')
        reason = request.data.get('reason')

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        refund = Refund.objects.create(order=order, reason=reason)
        return Response(serializers.RefundSerializer(refund).data, status=status.HTTP_201_CREATED)