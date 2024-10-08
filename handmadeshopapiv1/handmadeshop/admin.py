import cloudinary
import json
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.contrib import admin
from django import forms
from django.db.models import Count, Sum, F
from django.db.models.functions import TruncMonth, TruncDate
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

        total_product = Product.objects.count()
        total_product_quantity = Product.objects.aggregate(Sum('quantity'))['quantity__sum'] or 0
        total_completed_orders = Order.objects.filter(status='D').count()
        total_revenue = sum(order.total_order_price() for order in Order.objects.filter(status='D'))
        total_users = User.objects.count()
        total_blogs = Blog.objects.count()
        total_categories = Category.objects.count()
        total_vouchers = Voucher.objects.count()

        # Lấy sản phẩm theo danh mục
        category_data = Product.objects.values('category__name').annotate(total=Sum('quantity'))
        category_labels = [item['category__name'] for item in category_data]
        category_totals = [item['total'] for item in category_data]

        # Lấy sản phẩm
        product_data = Product.objects.values('name').annotate(total=Sum('quantity'))
        product_labels = [item['name'] for item in product_data]
        product_totals = [item['total'] for item in product_data]

        # Lấy đơn hàng
        order_status_data = Order.objects.values('status').annotate(total=Count('id'))
        order_status_labels = [dict(Order.ORDER_STATUS).get(item['status']) for item in order_status_data]
        order_status_totals = [item['total'] for item in order_status_data]

        # Lấy doanh thu theo tháng
        month_revenue_data = Order.objects.filter(status='D').annotate(month=TruncMonth('created_date')).values('month').annotate(
            total=Count('id'))
        month_revenue_labels = [item['month'].strftime('%Y-%m') for item in month_revenue_data]
        # Tính tổng doanh thu cho từng tháng
        month_revenue_totals = []
        for month in month_revenue_data:
            total_price = sum(order.total_order_price() for order in Order.objects.filter(
                status='D',
                created_date__month=month['month'].month,
                created_date__year=month['month'].year
            ))
            month_revenue_totals.append(total_price)

        # Lấy doanh thu theo ngày
        date_revenue_data = Order.objects.filter(status='D').annotate(day=TruncDate('created_date')).values('day').annotate(
            total=Sum('id'))
        date_revenue_labels = [item['day'].strftime('%Y-%m-%d') for item in date_revenue_data]
        # Tính doanh thu cho từng ngày
        date_revenue_totals = []
        for day in date_revenue_data:
            total_price = sum(order.total_order_price() for order in Order.objects.filter(
                status='D',
                created_date__date=day['day']
            ))
            date_revenue_totals.append(total_price)

        return TemplateResponse(request, 'admin/stats.html', {
            'total_products': total_product,
            'total_product_quantity': total_product_quantity,
            'total_completed_orders': total_completed_orders,
            'total_revenue': total_revenue,
            'total_users': total_users,
            'total_blogs': total_blogs,
            'total_categories': total_categories,
            'total_vouchers': total_vouchers,
            'product_labels': json.dumps(product_labels),
            'product_totals': json.dumps(product_totals),
            'category_labels': json.dumps(category_labels),
            'category_totals': json.dumps(category_totals),
            'order_status_labels': json.dumps(order_status_labels),
            'order_status_totals': json.dumps(order_status_totals),
            'month_revenue_labels': json.dumps(month_revenue_labels),
            'month_revenue_totals': json.dumps(month_revenue_totals),
            'date_revenue_labels': json.dumps(date_revenue_labels),
            'date_revenue_totals': json.dumps(date_revenue_totals),
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
    list_filter = ['status', 'payment_method']

class RefundAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "reason", "accepted", "created_date"]
    list_filter = ['accepted']

    def save_model(self, request, obj, form, change):
        if obj.accepted and obj.order.status == 'D':
            obj.order.status = 'R'
            obj.order.save()

        super().save_model(request, obj, form, change)


class VoucherAdmin(admin.ModelAdmin):
    list_display = ["code", "value", "description"]

# Register your models here.
admin_site.register(User, UserAdmin)
admin_site.register(Blog, BlogAdmin)
admin_site.register(BlogComment, BlogCommentAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(ProductComment, ProductCommentAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(Category)
admin_site.register(Cart, CartAdmin)
admin_site.register(Voucher, VoucherAdmin)
admin_site.register(Wishlist)
admin_site.register(Item)
admin_site.register(Refund, RefundAdmin)