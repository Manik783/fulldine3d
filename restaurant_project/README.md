# Restaurant Menu Management System

A comprehensive Django-based web application for managing restaurant menus with role-based access control. This system allows super administrators to manage multiple restaurants, while restaurant administrators can manage their specific restaurant's menu categories and dishes.

## Features

- **Role-Based Access Control**:
  - Super Admin: Manages restaurants and restaurant admins
  - Restaurant Admin: Manages menu categories and dishes

- **Restaurant Management**:
  - Add, edit, and delete restaurants
  - Create restaurant admin accounts

- **Menu Management**:
  - Organize dishes by categories
  - Add, edit, and delete categories
  - Add, edit, and delete dishes with images
  - Toggle dish availability

- **Public Menu**:
  - Beautiful, responsive public menu page for customers
  - Organized by categories
  - Shows only available dishes

## Technology Stack

- **Backend**: Django 4.2
- **Frontend**: Bootstrap 5, Font Awesome
- **Database**: SQLite (default), can be configured for PostgreSQL, MySQL, etc.
- **Image Handling**: Pillow

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd restaurant_project
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser (Super Admin):
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

7. Access the application at http://127.0.0.1:8000/

## Usage

### Super Admin

1. Log in with the superuser credentials at `/super-admin-login/`
2. Add restaurants from the dashboard
3. Create restaurant admin accounts for each restaurant

### Restaurant Admin

1. Log in with the provided credentials at `/restaurant-admin-login/`
2. Manage categories and dishes from the dashboard
3. Toggle dish availability as needed

### Public Menu

Access the public menu for a restaurant at `/menu/<restaurant-slug>/`

## Project Structure

```
restaurant_project/
├── menu_management/       # Main application
│   ├── models.py          # Database models
│   ├── views.py           # View functions
│   ├── forms.py           # Form definitions
│   ├── urls.py            # URL patterns
│   ├── decorators.py      # Custom decorators for access control
│   └── admin.py           # Admin site configuration
├── templates/             # HTML templates
│   ├── base.html          # Base template
│   └── menu_management/   # App-specific templates
├── static/                # Static files (CSS, JS, images)
│   ├── css/
│   └── js/
├── media/                 # User-uploaded files
│   └── dishes/            # Dish images
└── restaurant_project/    # Project settings
    ├── settings.py
    └── urls.py
```

## Customization

### Styling

The application uses Bootstrap 5 for styling. You can customize the appearance by modifying the CSS in `static/css/style.css`.

### Adding Features

Some potential enhancements:

- User registration and password reset
- Additional user roles (e.g., waitstaff)
- Online ordering functionality
- Menu item search and filtering
- Nutritional information for dishes

## License

This project is licensed under the MIT License - see the LICENSE file for details.