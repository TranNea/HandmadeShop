from rest_framework import serializers
from handmadeshop.models import *


class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'date_joined',
                  'last_login', 'role', 'is_active']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class StaticItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        #Hiển thị dường dân tuyệt đối của ảnh trên swagger
        rep = super().to_representation(instance)
        image = instance.image
        if image:
            rep['image'] = image.url
        return rep


class BlogSerializer(StaticItemSerializer):

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image']


class BlogCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    blog = BlogSerializer(read_only=True)

    class Meta:
        model = BlogComment
        fields = ['id', 'user', 'comment', 'blog', 'created_date']


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductSerializer(StaticItemSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'image1', 'image2', 'image3', 'image4', 'image5', 'description',
                  'price', 'discount', 'quantity', 'category']


class ProductCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = ProductComment
        fields = ['id', 'user', 'description', 'product', 'created_date']


class WishlistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product']


class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user']


class VoucherSerializer(serializers.ModelSerializer):

    class Meta:
        model = Voucher
        fields = ['id', 'code', 'value', 'description']


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    voucher = VoucherSerializer(read_only=True)

    total_order_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'payment_method', 'status', 'shipping_address', 'voucher', 'user', 'items', 'total_order_price']

    def get_total_order_price(self, obj):
        return obj.total_order_price()


class ItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    cart = CartSerializer(read_only=True)
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'quantity', 'product', 'cart', 'order', 'total_price', 'discount_total_price', 'final_price']


class RefundSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Refund
        fields = ['id', 'reason', 'accepted', 'order', 'created_date']