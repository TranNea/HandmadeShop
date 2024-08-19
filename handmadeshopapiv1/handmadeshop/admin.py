from django.contrib import admin
from handmadeshop.models import User, Blog, BlogComment, Product, ProductComment, Order, Category, Cart, Voucher, \
    Wishlist, Item, Refund

# Register your models here.
admin.site.register(User)
admin.site.register(Blog)
admin.site.register(BlogComment)
admin.site.register(Product)
admin.site.register(ProductComment)
admin.site.register(Order)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(Voucher)
admin.site.register(Wishlist)
admin.site.register(Item)
admin.site.register(Refund)