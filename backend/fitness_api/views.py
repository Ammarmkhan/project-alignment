from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, WorkOutSerializer
from .models import Workout
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import FileUploadParser
import io
import pandas as pd
from .utils import clean_data
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from .openai_key import openai_key
from openai import OpenAI


# Create signup and login
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# To upload and access workout data
class WorkOutViewSet(viewsets.ModelViewSet):
    # To accept csv uploads
    queryset = Workout.objects.all()
    serializer_class = WorkOutSerializer 
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    parser_classes = (FileUploadParser,)
    
    # To upload csv files
    def create(self, request, *args, **kwargs):
            try:
                # Extract the user from the request
                user = request.user

                # Clear current records before adding new ones
                Workout.objects.filter(user=user).delete()

                # Assuming the CSV file is sent in the 'file' field of the request
                decoded_file = request.body.decode('utf-8')

                # Use the csv module to parse the CSV data
                csv_file = io.StringIO(decoded_file)
                df = pd.read_csv(csv_file)
                
                # clean the data, removing duplicates and doing relevant conversions
                result = clean_data(df)
                
                # Save each workout with the associated user
                for index, row in result.iterrows():
                    # Accessing values from the current row
                    date_value = row['Date']
                    workout_name_value = row['Workout Name']
                    duration_value = row['Duration']
                    exercise_name_value = row['Exercise Name']
                    set_order_value = row['Set Order']
                    weight_value = row['Weight']
                    reps_value = row['Reps']
                    distance_value = row['Distance']
                    seconds_value = row['Seconds']
                    notes_value = row['Notes']
                    workout_notes_value = row['Workout Notes']
                    rpe_value = row['RPE']
                    chest = row['Chest']
                    back = row['Back']
                    arms = row['Arms']
                    abdominals = row['Abdominals']
                    legs = row['Legs']
                    shoulders = row['Shoulders']

                    # Creating workout_data dictionary
                    workout_data = {
                        'user': user,
                        'date': date_value,
                        'workout_name': workout_name_value,
                        'duration': duration_value,
                        'exercise_name': exercise_name_value,
                        'set_order': set_order_value,
                        'weight': weight_value,
                        'reps': reps_value,
                        'distance': distance_value,
                        'seconds': seconds_value,
                        'notes': notes_value,
                        'workout_notes': workout_notes_value,
                        'rpe': rpe_value,
                        'chest': chest,
                        'back': back,
                        'arms': arms,
                        'abdominals': abdominals,
                        'legs': legs,
                        'shoulders': shoulders,
                    }

                    # Create a new instance of PersonalWorkouts and save it
                    workout_instance = Workout(**workout_data)
                    workout_instance.save()

                return Response({'message': 'CSV data processed successfully'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                # Log the exception for debugging
                import traceback
                traceback.print_exc()
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


## Analyze for Visual Output
# ## For openAI API
def analyze(user_input):
    client = OpenAI(api_key=openai_key)
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {
                "role": "system",
                "content": "You are an assistant that considers user input and replies with the kind of visual they want to see. Your output will be a muscle name. The only acceptable outputs for 'muscle_name' are one word answers from the options 'chest', 'back', 'arms', 'abdominals', 'legs' & 'shoulders'. If the user throws in something unexpected, just return the word 'default' for muscle_name."
            },
            {
                "role": "user",
                "content": user_input
            }
        ]
    )
    return completion.choices[0].message.content

# For visual
@csrf_exempt
@require_POST
def analyze_paragraph(request):
    # Get the paragraph from the request
    paragraph = json.loads(request.body).get('paragraph', '')

    # apply the openAI API function
    word = analyze(paragraph)

    # Return the word as a JSON response
    return JsonResponse({'word': word})