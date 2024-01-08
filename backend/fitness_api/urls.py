from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, WorkOutViewSet


router = routers.DefaultRouter()
router.register('users', UserViewSet) # <-- To create user accounts
router.register('workouts', WorkOutViewSet) # <-- To upload & access workout data

urlpatterns = [
    path('', include(router.urls)),
]