# Generated by Django 5.0.1 on 2024-01-07 23:18

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fitness_api', '0003_alter_workouts_id'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Workouts',
            new_name='Workout',
        ),
    ]
