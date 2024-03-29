from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, WorkOutViewSet, analyze_paragraph, followup_question


router = routers.DefaultRouter()
router.register('users', UserViewSet) # <-- To create user accounts
router.register('workouts', WorkOutViewSet) # <-- To upload & access workout data

urlpatterns = [
    path('', include(router.urls)),
    path('analyze-paragraph/', analyze_paragraph, name='analyze_paragraph'),
    path('followup-question/', followup_question, name='followup_question'),

]