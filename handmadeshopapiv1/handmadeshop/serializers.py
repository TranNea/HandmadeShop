from rest_framework import serializers
from handmadeshop.models import *


class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    def update(self, instance, validated_data):
        data = validated_data.copy()

        if 'password' in data:
            instance.set_password(data.pop('password'))

        for attr, value in data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'date_joined',
                  'last_login', 'role', 'is_active', 'address1', 'address2', 'phone']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class StaticItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if hasattr(instance, 'image'):
            image = instance.image
            if image:
                rep['image'] = image.url

        for i in range(1, 6):
            image_field = f'image{i}'
            image = getattr(instance, image_field, None)
            if image:
                rep[image_field] = image.url

        return rep


class BlogSerializer(StaticItemSerializer):

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image'] + ['content']


class BlogCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = BlogComment
        fields = ['id', 'content', 'created_date', 'user']


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductSerializer(StaticItemSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'image1', 'image2', 'image3', 'image4', 'image5', 'description',
                  'price', 'discount', 'quantity', 'category', 'status'] + ['description']


class ProductCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ProductComment
        fields = ['id', 'description', 'created_date', 'user']


class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(source='user.id', read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product']


class ItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'quantity', 'product', 'total_price', 'discount_total_price', 'final_price']


class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']


class VoucherSerializer(serializers.ModelSerializer):

    class Meta:
        model = Voucher
        fields = ['id', 'code', 'value', 'description']


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    voucher = VoucherSerializer(read_only=True)
    items = ItemSerializer(many=True, read_only=True)

    total_order_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'payment_method', 'status', 'shipping_address', 'voucher', 'user', 'total_order_price',
                  'items', 'shipping_phone']

    def get_total_order_price(self, obj):
        return obj.total_order_price()


class RefundSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Refund
        fields = ['id', 'reason', 'order', 'created_date']