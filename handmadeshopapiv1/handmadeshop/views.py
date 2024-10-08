from django.contrib.admin.templatetags.admin_list import pagination
from django.shortcuts import render
from django.template.defaulttags import comment
from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from handmadeshop import serializers, paginators, perms
from handmadeshop.models import *
from .perms import CommentOwner
from django.db.models import Q

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
            serializer = serializers.UserSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    queryset = Blog.objects.all().order_by('-id')
    serializer_class = serializers.BlogSerializer
    pagination_class = paginators.BlogPaginator

    @action(methods=['get'], url_path='bcomments', detail=True)
    def get_blogcomment(self, request, pk):
        blogcomments = self.get_object().blogcomment_set.select_related('user').order_by('-id')
        return Response(serializers.BlogCommentSerializer(blogcomments, many=True).data)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_blogcomment(self, request, pk):
        c = self.get_object().blogcomment_set.create(content=request.data.get('content'), user=request.user)
        return Response(serializers.BlogCommentSerializer(c).data, status=status.HTTP_201_CREATED)


class BlogCommentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = BlogComment.objects.all()
    serializer_class = serializers.BlogCommentSerializer

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [CommentOwner()]

        return [permissions.AllowAny()]


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

        kw = self.request.query_params.get('kw')
        cate_id = self.request.query_params.get('category_id')

        if self.action.__eq__('list') and kw:
            queryset = queryset.filter(
                Q(name__icontains=kw) | Q(description__icontains=kw)
            )
        if cate_id:
            queryset = queryset.filter(category_id=cate_id)

        return queryset

    @action(methods=['get'], url_path='productcomments', detail=True)
    def get_productcomment(self, request, pk):
        productcomments = self.get_object().productcomment_set.select_related('user').order_by('-id')
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

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [CommentOwner()]

        return [permissions.AllowAny()]


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class WishlistViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = serializers.WishlistSerializer
    permission_classes = [perms.WishlistOwner]

    def get_queryset(self):
        user = self.request.user
        return Wishlist.objects.filter(user=user)


class CartViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Cart.objects.all()
    serializer_class = serializers.CartSerializer
    permission_classes = [perms.CartOwner]

    @action(methods=['get'], url_path='carts', detail=False)
    def get_cart_items(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            items = cart.items.filter(is_ordered=False)
            return Response(serializers.ItemSerializer(items, many=True).data, status=status.HTTP_200_OK)
        return Response({"detail": "No items found in cart."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_path='items', detail=False)
    def add_items(self, request):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        product_id = request.data.get('product_id')
        product = Product.objects.filter(id=product_id).first()

        quantity = request.data.get('quantity', 1)
        item = Item.objects.filter(cart=cart, product=product).first()
        if item:
            if item.is_ordered:
                item = Item.objects.create(cart=cart, product=product, quantity=quantity)
                cart.items.add(item)
                return Response({"detail": "New item added to cart."}, status=status.HTTP_201_CREATED)
            else:
                item.quantity += int(quantity)
                item.save()
                return Response({"detail": "Item quantity updated in cart."}, status=status.HTTP_200_OK)
        else:
            item = Item.objects.create(cart=cart, product=product, quantity=quantity)
            cart.items.add(item)
            return Response({"detail": "Item added to cart."}, status=status.HTTP_201_CREATED)

    @action(methods=['delete'], url_path='cartitems', detail=False)
    def delete_cartitems(self, request):
        product_id = request.data.get('product_id')
        product = Product.objects.get(id=product_id)

        cart = Cart.objects.get(user=self.request.user)
        item = Item.objects.filter(cart=cart, product=product).first()

        if item:
            cart.items.remove(item)
            item.delete()
            return Response({"detail": "Item removed from cart."}, status=status.HTTP_200_OK)

        return Response({"detail": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['patch'], url_path='itemquantity', detail=False)
    def update_item_quantity(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        product = Product.objects.filter(id=product_id).first()
        cart = Cart.objects.get(user=self.request.user)
        item = Item.objects.filter(cart=cart, product=product).first()

        if item:
            item.quantity = quantity
            item.save()
            return Response({"detail": "Item quantity updated in cart."}, status=status.HTTP_200_OK)

        return Response({"detail": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = serializers.OrderSerializer
    permission_classes = [perms.CartOwner]

    def get_queryset(self):
        queryset = self.queryset
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        return queryset

    @action(methods=['post'], url_path='orders', detail=False)
    def create_order(self, request):
        user = request.user
        payment_method = request.data.get('payment_method', 'C')
        shipping_address = request.data.get('shipping_address', '539 Hương Lộ 3, Sơn Kỳ, Tân Phú, TP. Hồ Chí Minh')
        shipping_phone = request.data.get('shipping_phone', '')
        voucher_code = request.data.get('voucher_code')

        voucher = None
        if voucher_code:
            try:
                voucher = Voucher.objects.get(code=voucher_code)
            except Voucher.DoesNotExist:
                return Response({"detail": "Invalid voucher code."}, status=status.HTTP_400_BAD_REQUEST)

        cart = Cart.objects.filter(user=user).first()

        order = Order.objects.create(
            user=user,
            payment_method=payment_method,
            shipping_address=shipping_address,
            shipping_phone=shipping_phone,
            voucher=voucher,
            cart=cart
        )

        # Lấy các items chưa được đặt hàng
        for item in cart.items.all():
            if not item.is_ordered:
                item.is_ordered = True
                item.save()
                order.items.add(item)

            # Cập nhật số lượng sản phẩm
            product = item.product
            product.quantity -= item.quantity
            product.save()

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
        orders = Order.objects.filter(user=user).order_by('-id')

        if not orders.exists():
            return Response({"detail": "Orders not found."},
                            status=status.HTTP_404_NOT_FOUND)

        return Response(serializers.OrderSerializer(orders, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='receiveorders', detail=True)
    def receive_order(self, request, pk=None):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status in ['P', 'R', 'C']:
            return Response({"detail": "Cannot receive order."},
                            status=status.HTTP_400_BAD_REQUEST)

        order.status = 'D'
        order.save()

        return Response(serializers.OrderSerializer(order).data, status=status.HTTP_200_OK)


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