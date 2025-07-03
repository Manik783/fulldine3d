from django.shortcuts import redirect
from django.contrib import messages
from functools import wraps

def super_admin_required(view_func):
    """Decorator to ensure only super_admin users can access a view"""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "You must be logged in to access this page.")
            return redirect('home')  # Redirect to home page with login options
        
        if request.user.role != 'super_admin':
            messages.error(request, "You don't have permission to access this page.")
            return redirect('dashboard')
            
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def restaurant_admin_required(view_func):
    """Decorator to ensure only restaurant_admin users can access a view"""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "You must be logged in to access this page.")
            return redirect('home')  # Redirect to home page with login options
        
        if request.user.role != 'restaurant_admin':
            messages.error(request, "You don't have permission to access this page.")
            return redirect('dashboard')
            
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def restaurant_owner_required(view_func):
    """Decorator to ensure restaurant admin can only access their own restaurant data"""
    @wraps(view_func)
    def _wrapped_view(request, restaurant_id=None, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "You must be logged in to access this page.")
            return redirect('home')  # Redirect to home page with login options
        
        if request.user.role != 'restaurant_admin':
            messages.error(request, "You don't have permission to access this page.")
            return redirect('dashboard')
        
        # If restaurant_id is provided, check if it matches the user's restaurant
        if restaurant_id and request.user.restaurant.id != int(restaurant_id):
            messages.error(request, "You don't have permission to access this restaurant's data.")
            return redirect('dashboard')
            
        return view_func(request, *args, **kwargs)
    return _wrapped_view