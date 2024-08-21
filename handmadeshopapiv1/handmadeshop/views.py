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
        if self.action in ['set_active','delete_user']:
            return [permissions.IsAdminUser()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                # setattr() được sử dụng để gán giá trị v cho thuộc tính có tên k trên đối tượng user
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

    @action(methods=['patch'], url_path='setactive', detail=True)
    def set_active(self,request,pk):
        instance = self.get_object()
        instance.is_active= not instance.is_active
        instance.save()

        return Response(serializers.UserSerializer(instance).data)


class BlogViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = serializers.BlogSerializer