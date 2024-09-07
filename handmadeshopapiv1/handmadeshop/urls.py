from django.contrib import admin
from django.urls import path, re_path ,include
from rest_framework import routers
from handmadeshop import views

r = routers.DefaultRouter()

r.register('users', views.UserViewSet, basename='users')
r.register('blogs', views.BlogViewSet, basename='blogs')
r.register('blogcomments', views.BlogCommentViewSet, basename='blogcomments')
r.register('products', views.ProductViewSet, basename='products')
r.register('productcomments', views.ProductCommentViewSet, basename='productcomments')
r.register('categories', views.CategoryViewSet, basename='categories')
r.register('wishlists', views.WishlistViewSet, basename='wishlists')
r.register('carts', views.CartViewSet, basename='carts')
r.register('orders', views.OrderViewSet, basename='orders')
r.register('vouchers', views.VoucherViewSet, basename='vouchers')
r.register('refunds', views.RefundViewSet, basename='refunds')

urlpatterns = [
    path('', include(r.urls))
]