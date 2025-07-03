from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('admin/', RedirectView.as_view(url='/django-admin/')),
    path('', include('menu_management.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    # Use Django's built-in static file serving for development
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
