from django.contrib import admin
from django.urls import path, re_path ,include
from rest_framework import routers
from handmadeshop import views

r = routers.DefaultRouter()

r.register('users', views.UserViewSet, basename='users')
r.register('blogs', views.BlogViewSet, basename='blogs')
r.register('blogcomments', views.BlogViewSet, basename='blogcomments')
r.register('products', views.ProductViewSet, basename='products')
r.register('wishlists', views.WishlistViewSet, basename='wishlists')

urlpatterns = [
    path('', include(r.urls))
]