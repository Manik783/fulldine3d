from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Restaurant, Category, Dish

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'restaurant')
    list_filter = ('role', 'restaurant')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Restaurant Info', {'fields': ('role', 'restaurant')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'restaurant'),
        }),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone', 'public_slug', 'created_at')
    search_fields = ('name', 'address', 'phone')
    readonly_fields = ('public_slug', 'created_at', 'updated_at')
    list_filter = ('created_at',)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'order', 'created_at')
    list_filter = ('restaurant',)
    search_fields = ('name', 'restaurant__name')

class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'serves', 'is_available', 'created_at')
    list_filter = ('category', 'is_available', 'category__restaurant')
    search_fields = ('name', 'description', 'category__name', 'category__restaurant__name')
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Restaurant, RestaurantAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Dish, DishAdmin)
