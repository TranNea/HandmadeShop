from rest_framework import permissions


class CommentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.user


class WishlistOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return super().has_permission(request, view) and obj.user == request.user


class CartOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return super().has_permission(request, view) and obj.user == request.user