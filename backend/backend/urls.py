from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', obtain_auth_token), # <-- for login
    path('fitness_api/', include('fitness_api.urls')), # <-- for signup & post-login pages
    
]
