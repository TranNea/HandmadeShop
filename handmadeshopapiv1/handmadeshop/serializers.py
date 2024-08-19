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


class BlogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image']


class BlogCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlogComment
        fields = ['id', 'user', 'comment', 'blog_id']


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'description', 'price', 'discount', 'quantity', 'category_id']


class ProductCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductComment
        fields = ['id', 'user', 'description', 'product_id']