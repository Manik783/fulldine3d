from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
import secrets
import string

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('restaurant_admin', 'Restaurant Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='restaurant_admin')
    restaurant = models.ForeignKey('Restaurant', on_delete=models.CASCADE, null=True, blank=True)

class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    public_slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.public_slug:
            base_slug = slugify(self.name)
            if not base_slug:  # Handle empty slug case
                base_slug = "restaurant"
            self.public_slug = base_slug
            # Ensure uniqueness
            counter = 1
            while Restaurant.objects.filter(public_slug=self.public_slug).exclude(id=self.id).exists():
                self.public_slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='categories')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"

class Dish(models.Model):
    FOOD_TYPE_CHOICES = [
        ('veg', 'Vegetarian'),
        ('non_veg', 'Non-Vegetarian'),
    ]
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='dishes/', blank=True, null=True)
    serves = models.CharField(max_length=50, help_text="e.g., 'Serves 1', 'Serves 2-3'")
    # Changed from ForeignKey to ManyToManyField to support multiple categories
    categories = models.ManyToManyField(Category, related_name='dishes')
    # Keep the original category field for backward compatibility
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='primary_dishes')
    is_available = models.BooleanField(default=True)
    is_vegetarian = models.CharField(max_length=10, choices=FOOD_TYPE_CHOICES, default='non_veg')
    # 3D model fields
    has_3d_model = models.BooleanField(default=False)
    glb_file = models.FileField(upload_to='dishes/3d_models/glb/', blank=True, null=True, 
                              help_text="Upload GLB file for 3D model (for web viewing)")
    usdz_file = models.FileField(upload_to='dishes/3d_models/usdz/', blank=True, null=True,
                               help_text="Upload USDZ file for 3D model (for iOS AR viewing)")
    # View tracking fields
    model_3d_views = models.PositiveIntegerField(default=0, verbose_name="3D Model Views")
    ar_views = models.PositiveIntegerField(default=0, verbose_name="AR Views")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category.restaurant.name} - {self.category.name} - {self.name}"
        
    def clean(self):
        """Validate that both 3D model files are provided if has_3d_model is True"""
        from django.core.exceptions import ValidationError
        
        if self.has_3d_model:
            if not self.glb_file:
                raise ValidationError({'glb_file': 'GLB file is required when 3D model is enabled.'})
            if not self.usdz_file:
                raise ValidationError({'usdz_file': 'USDZ file is required when 3D model is enabled.'})
        
        # If files are provided but has_3d_model is False, set it to True
        if not self.has_3d_model and (self.glb_file or self.usdz_file):
            self.has_3d_model = True

def generate_password():
    """Generate a random password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for i in range(12))
