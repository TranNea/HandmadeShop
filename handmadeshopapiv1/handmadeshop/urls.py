from django.contrib import admin
from django.urls import path, re_path ,include
from rest_framework import routers
from handmadeshop import views

r = routers.DefaultRouter()

r.register(r'users', views.UserViewSet, basename='users')
r.register(r'blogs', views.BlogViewSet, basename='blogs')

urlpatterns = [
    path('', include(r.urls))
]