from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from ckeditor.fields import RichTextField
from django.template.defaultfilters import truncatechars
from cloudinary.models import CloudinaryField


# Create your models here.

class User(AbstractUser):

    STATUS_CHOICES = (
        ('A', 'ADMIN'),
        ('C', 'CUSTOMER')
    )

    email = models.EmailField(_('email address'), unique=True, blank=True, null=True)
    role = models.CharField(max_length=20, choices=STATUS_CHOICES, default='C')
    first_name = models.CharField(max_length=20, blank=True)
    last_name = models.CharField(max_length=20, blank=True)
    address1 = models.CharField(max_length=255, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'A'
        elif self.role == 'A' and not self.is_superuser:
            self.role = 'C'
        super().save(*args, **kwargs)


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Blog(BaseModel):
    title = models.CharField(max_length=255, null=True)
    content = RichTextField()
    image = CloudinaryField(null=True, blank=True, width_field='imagewidth', height_field='imageheight')

    imagewidth = models.PositiveIntegerField(editable=False, default=401, null=True, blank=True)
    imageheight = models.PositiveIntegerField(editable=False, default=401, null=True, blank=True)

    @property
    def short_description(self):
        return truncatechars(self.body, 250)

    def __str__(self):
         return self.title


class BlogComment(BaseModel):
    content = RichTextField()

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.user} - {self.blog}'


class Category(BaseModel):
    name = models.CharField(max_length=50)

    def __str__(self):
         return self.name


class Product(BaseModel):

    PRODUCT_STATUS = (
        ('S', 'STOCK'),
        ('O', 'SOLD OUT')
    )

    name = models.CharField(max_length=255)
    description = RichTextField()
    price = models.FloatField()
    discount = models.FloatField(null=True, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=PRODUCT_STATUS, default='S')

    image1 = CloudinaryField(null=True, blank=True, width_field='imagewidth', height_field='imageheight')
    image2 = CloudinaryField(null=True, blank=True, width_field='imagewidth', height_field='imageheight')
    image3 = CloudinaryField(null=True, blank=True, width_field='imagewidth', height_field='imageheight')
    image4 = CloudinaryField(null=True, blank=True, width_field='imagewidth', height_field='imageheight')
    image5 = CloudinaryField(null=True, blank=True, width_field='imagewidth', height_field='imageheight')

    imagewidth = models.PositiveIntegerField(editable=False, default=401)
    imageheight = models.PositiveIntegerField(editable=False, default=401)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='category')

    def save(self, *args, **kwargs):
        if self.quantity is None or self.quantity == 0:
            self.status = 'O'
        else:
            self.status = 'S'

        super().save(*args, **kwargs)

    def __str__(self):
         return self.name


class ProductComment(BaseModel):
    description = RichTextField()

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.user} - {self.product}'


class Wishlist(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} : {self.product}"


class Cart(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Voucher(BaseModel):
    code = models.CharField(max_length=20)
    value = models.FloatField()
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
         return self.code


class Order(BaseModel):

    PAYMENT_METHOD = (
        ('B', 'BANKING'),
        ('Q', 'QR CODE'),
        ('C', 'COD')
    )

    ORDER_STATUS = (
        ('P', 'PREPARING'),
        ('S', 'SHIPPING'),
        ('D', 'DELIVERED'),
        ('R', 'RETURNING')
    )

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD, default='C')
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='P')
    shipping_address = models.CharField(max_length=255, default='539 Hương Lộ 3, Sơn Kỳ, Tân Phú, TP. Hồ Chí Minh')

    voucher = models.ForeignKey(Voucher, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

    def total_order_price(self):
        total = 0
        for item in self.items.all():
            total += item.final_price()
        if self.voucher:
            total -= self.voucher.value
        return total + 35000    #Tiền ship cố định 35000VNĐ cho mọi đơn hàng, địa chỉ


class Item(BaseModel):
    quantity = models.PositiveIntegerField(default=1)

    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE, null=True, blank=True)
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.quantity} of {self.product.name}"

    def total_price(self):
        return self.quantity * self.product.price

    def discount_total_price(self):
        discount = self.product.discount or 0
        return self.quantity * discount

    def final_price(self):
        if self.product.discount:
            return self.discount_total_price()
        return self.total_price()


class Refund(BaseModel):
    reason = models.CharField(max_length=255, null=True, blank=True)
    accepted = models.BooleanField(default=False)

    # 1 đơn hàng có thể yêu cầu hoàn tiền nhiều lần vì 1 đơn hàng có thể có nhiều sản phẩm
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='refund')

    def __str__(self):
        return f"{self.pk}"
