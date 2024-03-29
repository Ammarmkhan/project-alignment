from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_name = models.CharField(max_length=64, blank=True)
    date = models.DateTimeField(blank=True)
    duration = models.IntegerField(blank=True)
    set_order = models.IntegerField(blank=True)
    weight = models.FloatField(blank=True)
    reps = models.IntegerField(blank=True)
    distance = models.FloatField(blank=True)
    seconds = models.IntegerField(blank=True)
    notes = models.CharField(max_length=256, blank=True)
    workout_notes = models.CharField(max_length=256, blank=True)
    rpe = models.FloatField(blank=True, null=True)
    exercise_name = models.CharField(max_length=64, blank=True)
    chest = models.BooleanField(default=False)
    clavicular_head = models.BooleanField(default=False) 
    sternal_head = models.BooleanField(default=False)
    abdominal_head = models.BooleanField(default=False)
    lats = models.BooleanField(default=False)
    back = models.BooleanField(default=False)
    mid_back = models.BooleanField(default=False)
    mid_traps = models.BooleanField(default=False)
    rhomboids = models.BooleanField(default=False)
    biceps = models.BooleanField(default=False)
    triceps = models.BooleanField(default=False)
    shoulder = models.BooleanField(default=False)
    anterior_deltoids = models.BooleanField(default=False)
    lateral_deltoids = models.BooleanField(default=False)
    posterior_deltoids = models.BooleanField(default=False)
    upper_traps = models.BooleanField(default=False)
    quads = models.BooleanField(default=False)
    hamstrings = models.BooleanField(default=False)
    glutes = models.BooleanField(default=False)
    adductors = models.BooleanField(default=False)
    legs = models.BooleanField(default=False)
    calves = models.BooleanField(default=False)
    abdominals = models.BooleanField(default=False)
