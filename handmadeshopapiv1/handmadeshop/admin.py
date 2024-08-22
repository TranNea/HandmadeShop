import cloudinary
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.contrib import admin
from django import forms
from handmadeshop.models import User, Blog, BlogComment, Product, ProductComment, Order, Category, Cart, Voucher, \
    Wishlist, Item, Refund
from django.utils.html import mark_safe
from django.urls import path


class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "email", "role", "date_joined", "is_active"]


class BlogForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Blog
        fields = '__all__'


class BlogAdmin(admin.ModelAdmin):
    list_display = ["title", "created_date"]
    search_fields = ['title', 'description']
    list_filter = ['id', 'created_date', 'title']
    readonly_fields = ['my_image']
    forms = BlogForm

    def my_image(self, instance):
        if instance:
            if instance.image is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='401' src='/static/{instance.image.url}'/>")
            return mark_safe(f"<img width='401' src='/static/{instance.image.name}'/>")

class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ["user", "blog", "created_date"]


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Blog, BlogAdmin)
admin.site.register(BlogComment, BlogCommentAdmin)
admin.site.register(Product)
admin.site.register(ProductComment)
admin.site.register(Order)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(Voucher)
admin.site.register(Wishlist)
admin.site.register(Item)
admin.site.register(Refund)