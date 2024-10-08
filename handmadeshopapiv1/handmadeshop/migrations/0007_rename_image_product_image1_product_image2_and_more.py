# Generated by Django 5.1 on 2024-08-21 03:49

import cloudinary.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('handmadeshop', '0006_remove_productcomment_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='image',
            new_name='image1',
        ),
        migrations.AddField(
            model_name='product',
            name='image2',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='image3',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='image4',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='image5',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='imageheight',
            field=models.PositiveIntegerField(default=401, editable=False),
        ),
        migrations.AddField(
            model_name='product',
            name='imagewidth',
            field=models.PositiveIntegerField(default=401, editable=False),
        ),
    ]
