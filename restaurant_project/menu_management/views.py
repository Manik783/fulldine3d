from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Count, Sum, Q, Prefetch
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import CustomUser, Restaurant, Category, Dish
from .forms import (
    SuperAdminLoginForm, RestaurantAdminLoginForm, RestaurantForm, 
    RestaurantAdminCreationForm, CategoryForm, DishForm
)
from .decorators import super_admin_required, restaurant_admin_required
from .utils import generate_password

# Home and Authentication Views
def home(request):
    """Home page view"""
    return render(request, 'menu_management/home.html')

def super_admin_login(request):
    """Super admin login view"""
    if request.user.is_authenticated:
        return redirect('dashboard')
        
    if request.method == 'POST':
        form = SuperAdminLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None and user.role == 'super_admin':
                login(request, user)
                return redirect('super_admin_dashboard')
            else:
                messages.error(request, "Invalid username or password, or you don't have super admin privileges.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = SuperAdminLoginForm()
    return render(request, 'registration/super_admin_login.html', {'form': form})

def restaurant_admin_login(request):
    """Restaurant admin login view"""
    if request.user.is_authenticated:
        return redirect('dashboard')
        
    if request.method == 'POST':
        form = RestaurantAdminLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None and user.role == 'restaurant_admin':
                login(request, user)
                return redirect('restaurant_admin_dashboard')
            else:
                messages.error(request, "Invalid username or password, or you don't have restaurant admin privileges.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = RestaurantAdminLoginForm()
    return render(request, 'registration/restaurant_admin_login.html', {'form': form})

@login_required
def dashboard(request):
    """Redirect to appropriate dashboard based on user role"""
    if request.user.role == 'super_admin':
        return redirect('super_admin_dashboard')
    elif request.user.role == 'restaurant_admin':
        return redirect('restaurant_admin_dashboard')
    else:
        messages.error(request, "Your account doesn't have access to any dashboard.")
        return redirect('home')

@login_required
def user_logout(request):
    """Logout view"""
    logout(request)
    messages.success(request, "You have been successfully logged out.")
    return redirect('home')

# Super Admin Views
@super_admin_required
def super_admin_dashboard(request):
    """Super admin dashboard view"""
    restaurants = Restaurant.objects.all().order_by('-created_at')
    
    # Calculate total stats across all restaurants
    total_restaurants = restaurants.count()
    total_categories = Category.objects.count()
    total_dishes = Dish.objects.count()
    total_3d_views = Dish.objects.aggregate(Sum('model_3d_views'))['model_3d_views__sum'] or 0
    total_ar_views = Dish.objects.aggregate(Sum('ar_views'))['ar_views__sum'] or 0
    
    # Calculate stats for each restaurant
    for restaurant in restaurants:
        restaurant.dishes_count = Dish.objects.filter(category__restaurant=restaurant).count()
        restaurant.categories_count = Category.objects.filter(restaurant=restaurant).count()
        restaurant.model_3d_views = Dish.objects.filter(category__restaurant=restaurant).aggregate(Sum('model_3d_views'))['model_3d_views__sum'] or 0
        restaurant.ar_views = Dish.objects.filter(category__restaurant=restaurant).aggregate(Sum('ar_views'))['ar_views__sum'] or 0
        restaurant.has_admin = CustomUser.objects.filter(restaurant=restaurant, role='restaurant_admin').exists()
    
    return render(request, 'menu_management/super_admin_dashboard.html', {
        'restaurants': restaurants,
        'total_restaurants': total_restaurants,
        'total_categories': total_categories,
        'total_dishes': total_dishes,
        'total_3d_views': total_3d_views,
        'total_ar_views': total_3d_views
    })

@super_admin_required
def add_restaurant(request):
    """Add restaurant view"""
    if request.method == 'POST':
        form = RestaurantForm(request.POST)
        if form.is_valid():
            restaurant = form.save()
            messages.success(request, f"Restaurant '{restaurant.name}' has been created successfully.")
            return redirect('create_restaurant_admin', restaurant_id=restaurant.id)
    else:
        form = RestaurantForm()
    
    return render(request, 'menu_management/add_restaurant.html', {'form': form})

@super_admin_required
def edit_restaurant(request, restaurant_id):
    """Edit restaurant view"""
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    
    if request.method == 'POST':
        form = RestaurantForm(request.POST, instance=restaurant)
        if form.is_valid():
            form.save()
            messages.success(request, f"Restaurant '{restaurant.name}' has been updated successfully.")
            return redirect('super_admin_dashboard')
    else:
        form = RestaurantForm(instance=restaurant)
    
    return render(request, 'menu_management/edit_restaurant.html', {
        'form': form,
        'restaurant': restaurant
    })

@super_admin_required
def delete_restaurant(request, restaurant_id):
    """Delete restaurant view"""
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    
    if request.method == 'POST':
        restaurant_name = restaurant.name
        restaurant.delete()
        messages.success(request, f"Restaurant '{restaurant_name}' has been deleted successfully.")
        return redirect('super_admin_dashboard')
    
    return render(request, 'menu_management/delete_restaurant.html', {'restaurant': restaurant})

@super_admin_required
def create_restaurant_admin(request, restaurant_id):
    """Create restaurant admin view"""
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    
    # Check if restaurant already has an admin
    existing_admin = CustomUser.objects.filter(restaurant=restaurant, role='restaurant_admin').first()
    if existing_admin:
        messages.warning(request, f"This restaurant already has an admin: {existing_admin.username}")
        return redirect('super_admin_dashboard')
    
    if request.method == 'POST':
        form = RestaurantAdminCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.role = 'restaurant_admin'
            user.restaurant = restaurant
            
            # Generate a random password if not provided
            user.save()
            
            # Generate a random password if not provided
            if not form.cleaned_data.get('password1'):
                password = generate_password()
                user.set_password(password)
                user.save()
            messages.success(request, f"Restaurant admin for '{restaurant.name}' has been created successfully.")
            
            # If we generated a password, show it to the super admin
            if not form.cleaned_data.get('password1'):
                messages.info(request, f"Generated credentials - Username: {user.username}, Password: {password}")
            
            return redirect('super_admin_dashboard')
    else:
        form = RestaurantAdminCreationForm()
    
    return render(request, 'menu_management/create_restaurant_admin.html', {
        'form': form,
        'restaurant': restaurant
    })

# Restaurant Admin Views
@restaurant_admin_required
def restaurant_admin_dashboard(request):
    """Restaurant admin dashboard view"""
    if not request.user.restaurant:
        messages.error(request, "Your account is not associated with any restaurant.")
        return redirect('home')
    
    restaurant = request.user.restaurant
    categories_count = Category.objects.filter(restaurant=restaurant).count()
    dishes_count = Dish.objects.filter(category__restaurant=restaurant).count()
    
    # Calculate total 3D and AR views for this restaurant
    dishes = Dish.objects.filter(category__restaurant=restaurant)
    total_3d_views = sum(dish.model_3d_views for dish in dishes)
    total_ar_views = sum(dish.ar_views for dish in dishes)
    
    return render(request, 'menu_management/restaurant_admin_dashboard.html', {
        'restaurant': restaurant,
        'categories_count': categories_count,
        'dishes_count': dishes_count,
        'total_3d_views': total_3d_views,
        'total_ar_views': total_ar_views
    })

# Category Management Views
@restaurant_admin_required
def category_list(request):
    """Category list view"""
    if not request.user.restaurant:
        messages.error(request, "Your account is not associated with any restaurant.")
        return redirect('home')
    
    restaurant = request.user.restaurant
    categories = Category.objects.filter(restaurant=restaurant).annotate(
        available_dish_count=Count('dishes', filter=Q(dishes__is_available=True))
    ).order_by('order', 'name')
    
    return render(request, 'menu_management/category_list.html', {
        'categories': categories,
        'restaurant': restaurant
    })

@restaurant_admin_required
def add_category(request):
    """Add category view"""
    if not request.user.restaurant:
        messages.error(request, "Your account is not associated with any restaurant.")
        return redirect('home')
    
    restaurant = request.user.restaurant
    
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            category = form.save(commit=False)
            category.restaurant = restaurant
            category.save()
            messages.success(request, f"Category '{category.name}' has been added successfully.")
            return redirect('category_list')
    else:
        form = CategoryForm()
    
    return render(request, 'menu_management/add_category.html', {
        'form': form,
        'restaurant': restaurant
    })

@restaurant_admin_required
def edit_category(request, category_id):
    """Edit category view"""
    category = get_object_or_404(Category, id=category_id)
    
    # Ensure the category belongs to the admin's restaurant
    if category.restaurant != request.user.restaurant:
        messages.error(request, "You don't have permission to edit this category.")
        return redirect('category_list')
    
    if request.method == 'POST':
        form = CategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            messages.success(request, f"Category '{category.name}' has been updated successfully.")
            return redirect('category_list')
    else:
        form = CategoryForm(instance=category)
    
    return render(request, 'menu_management/edit_category.html', {
        'form': form,
        'category': category,
        'restaurant': request.user.restaurant
    })

@restaurant_admin_required
def delete_category(request, category_id):
    """Delete category view"""
    category = get_object_or_404(Category, id=category_id)
    
    # Ensure the category belongs to the admin's restaurant
    if category.restaurant != request.user.restaurant:
        messages.error(request, "You don't have permission to delete this category.")
        return redirect('category_list')
    
    if request.method == 'POST':
        category_name = category.name
        category.delete()
        messages.success(request, f"Category '{category_name}' has been deleted successfully.")
        return redirect('category_list')
    
    return render(request, 'menu_management/delete_category.html', {'category': category})

# Dish Management Views
@restaurant_admin_required
def dish_list(request):
    """Dish list view"""
    if not request.user.restaurant:
        messages.error(request, "Your account is not associated with any restaurant.")
        return redirect('home')
    
    restaurant = request.user.restaurant
    dishes = Dish.objects.filter(category__restaurant=restaurant).select_related('category')
    
    # Filter by category if provided
    category_id = request.GET.get('category')
    if category_id:
        dishes = dishes.filter(category_id=category_id)
    
    # Pagination
    paginator = Paginator(dishes, 10)  # Show 10 dishes per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get categories for filter dropdown
    categories = Category.objects.filter(restaurant=restaurant)
    
    return render(request, 'menu_management/dish_list.html', {
        'page_obj': page_obj,
        'categories': categories,
        'selected_category': category_id,
        'restaurant': restaurant
    })

@restaurant_admin_required
def dish_detail_dashboard(request):
    """Comprehensive dish detail dashboard view"""
    if not request.user.restaurant:
        messages.error(request, "Your account is not associated with any restaurant.")
        return redirect('home')
    
    restaurant = request.user.restaurant
    dishes_queryset = Dish.objects.filter(category__restaurant=restaurant).select_related('category').order_by('name')
    
    # Filter by category if provided
    category_id = request.GET.get('category')
    if category_id:
        dishes_queryset = dishes_queryset.filter(category_id=category_id)
    
    # Filter by vegetarian status
    veg_filter = request.GET.get('veg_filter')
    if veg_filter == 'veg':
        dishes_queryset = dishes_queryset.filter(is_vegetarian='veg')
    elif veg_filter == 'non_veg':
        dishes_queryset = dishes_queryset.filter(is_vegetarian='non_veg')
    
    # Filter by 3D model status
    model_filter = request.GET.get('model_filter')
    if model_filter == 'enabled':
        dishes_queryset = dishes_queryset.filter(has_3d_model=True)
    elif model_filter == 'disabled':
        dishes_queryset = dishes_queryset.filter(has_3d_model=False)
    
    # Pagination
    paginator = Paginator(dishes_queryset, 10)  # Show 10 dishes per page
    page_number = request.GET.get('page')
    dishes = paginator.get_page(page_number)
    
    # Get categories for filter dropdown
    categories = Category.objects.filter(restaurant=restaurant)
    
    # Calculate statistics
    total_dishes = dishes_queryset.count()
    available_dishes_count = dishes_queryset.filter(is_available=True).count()
    total_3d_views = sum(dish.model_3d_views for dish in dishes_queryset)
    total_ar_views = sum(dish.ar_views for dish in dishes_queryset)
    
    return render(request, 'menu_management/dish_detail_dashboard.html', {
        'dishes': dishes,
        'categories': categories,
        'selected_category': category_id,
        'veg_filter': veg_filter,
        'model_filter': model_filter,
        'restaurant': restaurant,
        'dishes_count': total_dishes,
        'available_dishes_count': available_dishes_count,
        'total_3d_views': total_3d_views,
        'total_ar_views': total_ar_views,
        'paginator': paginator
    })

@restaurant_admin_required
def add_dish(request):
    """Add dish view"""
    if not request.user.restaurant:
        messages.error(request, "Your account is not associated with any restaurant.")
        return redirect('home')
    
    restaurant = request.user.restaurant
    
    if request.method == 'POST':
        form = DishForm(restaurant, request.POST, request.FILES)
        if form.is_valid():
            # Save the form without committing to get the dish instance
            dish = form.save(commit=False)
            dish.save()  # Save the dish instance first
            
            # Handle the categories
            # Add the primary category to the categories ManyToManyField
            dish.categories.add(dish.category)
            
            # Then add any additional categories selected
            additional_categories = form.cleaned_data.get('additional_categories')
            if additional_categories:
                dish.categories.add(*additional_categories)
            
            messages.success(request, f"Dish '{dish.name}' has been added successfully.")
            return redirect('dish_list')
    else:
        form = DishForm(restaurant)
    
    return render(request, 'menu_management/add_dish.html', {'form': form})

@restaurant_admin_required
def edit_dish(request, dish_id):
    """Edit dish view"""
    dish = get_object_or_404(Dish, id=dish_id)
    
    # Ensure the dish belongs to the admin's restaurant
    if dish.category.restaurant != request.user.restaurant:
        messages.error(request, "You don't have permission to edit this dish.")
        return redirect('dish_list')
    
    if request.method == 'POST':
        form = DishForm(request.user.restaurant, request.POST, request.FILES, instance=dish)
        if form.is_valid():
            # Save the form without committing to get the dish instance
            dish_instance = form.save(commit=False)
            dish_instance.save()  # Save the dish instance first
            
            # Handle the categories
            # Clear existing categories first
            dish_instance.categories.clear()
            
            # Add the primary category to the categories ManyToManyField
            dish_instance.categories.add(dish_instance.category)
            
            # Then add any additional categories selected
            additional_categories = form.cleaned_data.get('additional_categories')
            if additional_categories:
                dish_instance.categories.add(*additional_categories)
            
            messages.success(request, f"Dish '{dish_instance.name}' has been updated successfully.")
            return redirect('dish_list')
    else:
        form = DishForm(request.user.restaurant, instance=dish)
    
    return render(request, 'menu_management/edit_dish.html', {
        'form': form,
        'dish': dish
    })

@restaurant_admin_required
def delete_dish(request, dish_id):
    """Delete dish view"""
    dish = get_object_or_404(Dish, id=dish_id)
    
    # Ensure the dish belongs to the admin's restaurant
    if dish.category.restaurant != request.user.restaurant:
        messages.error(request, "You don't have permission to delete this dish.")
        return redirect('dish_list')
    
    if request.method == 'POST':
        dish_name = dish.name
        dish.delete()
        messages.success(request, f"Dish '{dish_name}' has been deleted successfully.")
        return redirect('dish_list')
    
    return render(request, 'menu_management/delete_dish.html', {'dish': dish})

@restaurant_admin_required
def toggle_dish_availability(request, dish_id):
    """Toggle dish availability view"""
    dish = get_object_or_404(Dish, id=dish_id)
    
    # Ensure the dish belongs to the admin's restaurant
    if dish.category.restaurant != request.user.restaurant:
        messages.error(request, "You don't have permission to modify this dish.")
        return redirect('dish_list')
    
    dish.is_available = not dish.is_available
    dish.save()
    
    status = "available" if dish.is_available else "unavailable"
    messages.success(request, f"Dish '{dish.name}' is now {status}.")
    
    # Redirect back to the referring page
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', reverse('dish_list')))

# Public Menu Views
def public_menu(request, public_slug):
    """Public menu view - Swiggy style with category sections"""
    restaurant = get_object_or_404(Restaurant, public_slug=public_slug)
    
    # Get categories with dish counts and prefetched available dishes
    categories = Category.objects.filter(
        restaurant=restaurant
    ).annotate(
        dish_count=Count('dishes', filter=Q(dishes__is_available=True))
    ).prefetch_related(
        Prefetch('dishes',
                queryset=Dish.objects.filter(is_available=True),
                to_attr='available_dishes')
    ).order_by('order', 'name')
    
    # Get all available dishes for the restaurant
    all_dishes = Dish.objects.filter(
        categories__restaurant=restaurant,
        is_available=True
    ).distinct().order_by('name')
    
    return render(request, 'menu_management/public_menu.html', {
        'restaurant': restaurant,
        'categories': categories,
        'all_dishes': all_dishes
    })

# NEW DYNAMIC MENU VIEW
def dynamic_menu(request, restaurant_slug):
    """Dynamic menu view that works for all restaurant owners"""
    restaurant = get_object_or_404(Restaurant, public_slug=restaurant_slug)
    
    # Get all categories for the restaurant
    categories = Category.objects.filter(restaurant=restaurant).order_by('order', 'name')
    
    # Prepare category data with dishes
    category_data = []
    for category in categories:
        # Get available dishes for this category
        dishes = Dish.objects.filter(
            categories=category,
            is_available=True
        ).order_by('name')
        
        if dishes.exists():
            category_data.append({
                'category': category,
                'dishes': dishes
            })
    
    return render(request, 'menu_management/dynamic_menu.html', {
        'restaurant': restaurant,
        'category_data': category_data
    })

# 3D Model and AR Viewing
from django.http import JsonResponse

def get_dish_3d_data(request, dish_id):
    """Returns 3D model and dish details as JSON for modal"""
    dish = get_object_or_404(Dish, id=dish_id)
    
    data = {
        'id': dish.id,
        'name': dish.name,
        'description': dish.description,
        'price': str(dish.price), # Convert Decimal to string
        'serves': dish.serves,
        'is_vegetarian': dish.is_vegetarian,
        'has_3d_model': dish.has_3d_model,
        'glb_file_url': dish.glb_file.url if dish.glb_file else None,
        'usdz_file_url': dish.usdz_file.url if dish.usdz_file else None,
    }
    return JsonResponse(data)

def view_ar_model(request, dish_id):
    """View AR model of a dish (direct link for mobile AR)"""
    dish = get_object_or_404(Dish, id=dish_id, has_3d_model=True)
    # Redirect to the appropriate AR file based on user agent or just provide the USDZ/GLB
    # For simplicity, we'll just redirect to the USDZ for iOS and GLB for Android/others
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
    if 'iphone' in user_agent or 'ipad' in user_agent:
        if dish.usdz_file:
            return redirect(dish.usdz_file.url)
    if dish.glb_file:
        return redirect(dish.glb_file.url)
    
    messages.error(request, "No suitable AR model found for this device.")
    return redirect('public_menu', public_slug=dish.categories.first().restaurant.public_slug) # Redirect back to menu

# API endpoints for tracking views
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_POST
def track_3d_view(request, dish_id):
    """Track 3D model view"""
    dish = get_object_or_404(Dish, id=dish_id)
    dish.model_3d_views += 1
    dish.save(update_fields=['model_3d_views'])
    return JsonResponse({'success': True, 'views': dish.model_3d_views})

@csrf_exempt
@require_POST
def track_ar_view(request, dish_id):
    """Track AR view"""
    dish = get_object_or_404(Dish, id=dish_id)
    dish.ar_views += 1
    dish.save(update_fields=['ar_views'])
    return JsonResponse({'success': True, 'views': dish.ar_views})
