from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Workout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        # Ensure password is write-only
        extra_kwargs = {'password': {'write_only': True, 'required': True}}
    # Ensuring password is hashed
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # Create token for user
        Token.objects.create(user=user)
        return user
    
class WorkOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'