from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Workout
import csv
from rest_framework.authtoken.models import Token
import io
import json



#### For user story 'Log-in & upload workout data' ####


# Acceptance Criteria 1 - Signup
class CreateAccountAPITestCase(APITestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword',
        }

    def test_create_account(self):
        response = self.client.post('/fitness_api/users/', self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_create_user_with_existing_username(self):
        # Create a user with the same username
        User.objects.create_user(**self.user_data)

        response = self.client.post('/fitness_api/users/', self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_users_list(self):
        # Create some users
        User.objects.create_user(username='user1', password='pass1')
        User.objects.create_user(username='user2', password='pass2')

        response = self.client.get('/fitness_api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_user_details(self):
        # Create a user
        user = User.objects.create_user(**self.user_data)

        response = self.client.get(f'/fitness_api/users/{user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

# Acceptance Criteria 2 - Login
class UserAuthenticationTests(APITestCase):
    def setUp(self):
        # Create a test user with a hashed password
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_user_login_success(self):
        # Make a POST request to the user login endpoint with valid credentials
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post('/auth/', data, format='json')

        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_login_failure_nonexistent_user(self):
        # Make a POST request to the user login endpoint with invalid credentials
        data = {'username': 'nonexistentuser', 'password': 'invalidpassword'}
        response = self.client.post('/auth/', data, format='json')

        # Assert that the response status code is HTTP 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Assert that the response contains an appropriate error message
        self.assertIn('non_field_errors', response.data)

    def test_user_login_failure_invalid_password(self):
        # Make a POST request to the user login endpoint with valid username and invalid password
        data = {'username': 'testuser', 'password': 'invalidpassword'}
        response = self.client.post('/auth/', data, format='json')

        # Assert that the response status code is HTTP 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Assert that the response contains an appropriate error message
        self.assertIn('non_field_errors', response.data)

# Acceptance Criteria 4 - Upload workout data
class WorkoutUploadTestCase(TestCase):    

    def test_workout_csv_upload(self):

        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a token for the user
        self.token = Token.objects.create(user=self.user)

        # Create a client
        self.client = APIClient()

        # Authenticate the client with the token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Create a sample CSV file content
        csv_data = b'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n2022-11-15 21:37:50,"Evening Workout",32s,"Aerobics",1,0,0,0,2460,"","",\n2022-11-15 21:41:03,"5km",19s,"Aerobics",1,0,0,0,2450,"","",\n2022-11-15 21:49:17,"5km",8s,"Aerobics",1,0,0,0,2292,"","",\n2022-11-15 21:51:04,"Push 1",2min,"Bench Press (Barbell)",1,105.0,10,0,0,"","",8\n2022-11-15 21:51:04,"Push 1",2min,"Shoulder Press (Plate Loaded)",1,110.23113109243879,9,0,0,"",,\n'

        # Make an upload request
        response = self.client.post('/fitness_api/workouts/', csv_data, content_type="text/csv")

        # Check if the upload was successful (HTTP status code 201 - Created)
        self.assertEqual(response.status_code, 201)

        # Check if the response is a success message
        self.assertEqual(response.json(), {"message":"CSV data processed successfully"})

        
        # Check if the upload was successful (HTTP status code 201 - Created)
        self.assertEqual(response.status_code, 201)


        # Check if the uploaded data is saved in the database
        uploaded_workouts = Workout.objects.filter(
            date__lte='2022-11-15 21:51:04',  
            exercise_name__in=['Aerobics', 'Bench Press (Barbell)'], 
        )

        # Assert that there is at least one workout matching the criteria in the database
        self.assertGreater(uploaded_workouts.count(), 0)
            
    # Check if database emptied after upload
    def test_csv_upload_duplication(self):

        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a token for the user
        self.token = Token.objects.create(user=self.user)

        # Create a client
        self.client = APIClient()

        # Authenticate the client with the token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Create a sample CSV file content
        # csv_data = b'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n2022-11-15 21:37:50,"Evening Workout",32s,"Aerobics",1,0,0,0,2460,"","",\n2022-11-15 21:41:03,"5km",19s,"Aerobics",1,0,0,0,2450,"","",\n2022-11-15 21:49:17,"5km",8s,"Aerobics",1,0,0,0,2292,"","",\n2022-11-15 21:51:04,"Push 1",2min,"Bench Press (Barbell)",1,105.0,10,0,0,"","",8\n2022-11-15 21:51:04,"Push 1",2min,"Shoulder Press (Plate Loaded)",1,110.23113109243879,9,0,0,"",,\n'
        csv_data = b'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n2022-11-15 21:37:50,"Evening Workout",32s,"Aerobics",1,0,0,0,2460,"","",\n'
        # Make an upload request
        response = self.client.post('/fitness_api/workouts/', csv_data, content_type="text/csv")
        
        # Check the count of records in the database after the first upload
        workout_count_after_first_upload = Workout.objects.count()
        self.assertEqual(workout_count_after_first_upload, 1)  # Adjust based on your actual data

        # Create a sample CSV file content for the second upload with a different length
        csv_content2 = b'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n2022-11-15 21:37:50,"Evening Workout",32s,"Aerobics",1,0,0,0,2460,"","",\n2023-12-12 21:05:30,"Full body",50min,"Face Pull (Cable)",1,90.0,5,0,0,"",,\n'

        # Make the second upload request
        response_2 = self.client.post('/fitness_api/workouts/', csv_content2, content_type="text/csv")

        # Check the count of records in the database after the second upload
        workout_count_after_second_upload = Workout.objects.count()
        self.assertEqual(workout_count_after_second_upload, 2)  # Adjust based on your actual data