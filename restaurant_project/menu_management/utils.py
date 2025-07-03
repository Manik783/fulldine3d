import secrets
import string
from django.utils.text import slugify

def generate_password():
    """Generate a random password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for i in range(12))

def generate_public_slug(name):
    """Generate a unique public slug for a restaurant"""
    base_slug = slugify(name)
    if not base_slug:  # Handle empty slug case
        base_slug = "restaurant"
    return base_slug