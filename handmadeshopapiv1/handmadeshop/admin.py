import cloudinary
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.contrib import admin
from django import forms
from django.db.models import Count, Sum, F
from django.db.models.functions import TruncMonth
from datetime import datetime
from handmadeshop.models import User, Blog, BlogComment, Product, ProductComment, Order, Category, Cart, Voucher, \
    Wishlist, Item, Refund
from django.utils.html import mark_safe
from django.urls import path
from django.template.response import TemplateResponse

class MyHandmadeShopAdminSite(admin.AdminSite):
    site_header = 'HandmadeShop'

    def get_urls(self):
        return [path('handmadeshop-stats/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        current_year = datetime.now().year

        monthly_sales = Order.objects.filter(
            created_date__year=current_year
        ).annotate(
            month=TruncMonth('created_date')
        ).values('month').annotate(
            total_orders=Count('id'),
            total_revenue=Sum('cart__items__product__price')
        ).order_by('month')

        best_selling_products = Item.objects.filter(
            cart__order__status='D',
            cart__order__created_date__year=current_year
        ).values('product__name').annotate(
            total_quantity=Sum('quantity')
        ).order_by('-total_quantity')[:5]

        total_product = Product.objects.count()

        total_product_quantity = Product.objects.aggregate(Sum('quantity'))['quantity__sum'] or 0

        total_completed_orders = Order.objects.filter(status='D').count()

        total_revenue = Order.objects.filter(status='D').aggregate(
            total=Sum(F('cart__items__product__price') * F('cart__items__quantity'))
        )['total'] or 0

        return TemplateResponse(request, 'admin/stats.html', {
            'monthly_sales': monthly_sales,
            'best_selling_products': best_selling_products,
            'total_categories': total_product,
            'total_product_quantity': total_product_quantity,
            'total_completed_orders': total_completed_orders,
            'total_revenue': total_revenue,
        })

admin_site = MyHandmadeShopAdminSite(name='MyHandmadeShop')

class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "email", "role", "date_joined", "is_active"]


class BlogForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Blog
        fields = '__all__'


class BlogAdmin(admin.ModelAdmin):
    list_display = ["title", "created_date"]
    search_fields = ['title', 'content']
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


class CartAdmin(admin.ModelAdmin):
    list_display = ["user", "created_date"]


class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'quantity', 'category', 'status']
    search_fields = ['name', 'description']
    list_filter = ['price', 'category', 'status']


class ProductCommentAdmin(admin.ModelAdmin):
    list_display = ["user", "product", "description"]


class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "status", "payment_method", "total_order_price","created_date"]

class RefundAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "reason", "accepted", "created_date"]
    list_filter = ['accepted']

    def save_model(self, request, obj, form, change):
        if obj.accepted and obj.order.status == 'D':
            obj.order.status = 'R'
            obj.order.save()

        super().save_model(request, obj, form, change)

# Register your models here.
admin_site.register(User, UserAdmin)
admin_site.register(Blog, BlogAdmin)
admin_site.register(BlogComment, BlogCommentAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(ProductComment, ProductCommentAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(Category)
admin_site.register(Cart, CartAdmin)
admin_site.register(Voucher)
admin_site.register(Wishlist)
admin_site.register(Item)
admin_site.register(Refund, RefundAdmin)