from django.urls import path
from . import views

urlpatterns = [
    # Home and Authentication URLs
    path('', views.home, name='home'),
    path('super-admin-login/', views.super_admin_login, name='super_admin_login'),
    path('restaurant-admin-login/', views.restaurant_admin_login, name='restaurant_admin_login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('logout/', views.user_logout, name='logout'),
    
    # Super Admin URLs
    path('super-admin-dashboard/', views.super_admin_dashboard, name='super_admin_dashboard'),
    path('add-restaurant/', views.add_restaurant, name='add_restaurant'),
    path('edit-restaurant/<int:restaurant_id>/', views.edit_restaurant, name='edit_restaurant'),
    path('delete-restaurant/<int:restaurant_id>/', views.delete_restaurant, name='delete_restaurant'),
    path('create-restaurant-admin/<int:restaurant_id>/', views.create_restaurant_admin, name='create_restaurant_admin'),
    
    # Restaurant Admin URLs
    path('restaurant-admin-dashboard/', views.restaurant_admin_dashboard, name='restaurant_admin_dashboard'),
    
    # Category Management URLs
    path('categories/', views.category_list, name='category_list'),
    path('add-category/', views.add_category, name='add_category'),
    path('edit-category/<int:category_id>/', views.edit_category, name='edit_category'),
    path('delete-category/<int:category_id>/', views.delete_category, name='delete_category'),
    
    # Dish Management URLs
    path('dishes/', views.dish_list, name='dish_list'),
    path('dish-dashboard/', views.dish_detail_dashboard, name='dish_detail_dashboard'),
    path('add-dish/', views.add_dish, name='add_dish'),
    path('edit-dish/<int:dish_id>/', views.edit_dish, name='edit_dish'),
    path('delete-dish/<int:dish_id>/', views.delete_dish, name='delete_dish'),
    path('toggle-dish-availability/<int:dish_id>/', views.toggle_dish_availability, name='toggle_dish_availability'),
    
    # Public Menu URL
    path('menu/<slug:public_slug>/', views.public_menu, name='public_menu'),
    
    # 3D Model and AR Viewing URLs
    path('api/dish-3d-data/<int:dish_id>/', views.get_dish_3d_data, name='get_dish_3d_data'),
    path('menu_management/view_ar_model/<int:dish_id>/', views.view_ar_model, name='view_ar_model'),
    
    # API endpoints for tracking views
    path('api/track-3d-view/<int:dish_id>/', views.track_3d_view, name='track_3d_view'),
    path('api/track-ar-view/<int:dish_id>/', views.track_ar_view, name='track_ar_view'),
    path('api/increment-3d-view/<int:dish_id>/', views.track_3d_view, name='increment_3d_view'),
    path('api/increment-ar-view/<int:dish_id>/', views.track_ar_view, name='increment_ar_view'),
]