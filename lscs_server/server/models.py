from django.contrib.auth.models import AbstractUser

from django.db import models

ROLE = (
    ('0', 'ADMIN'),
    ('1', 'MANAGER'),
    ('2', 'SURVEYOR'),
)


class Employee(AbstractUser):
    role = models.CharField(max_length=1, choices=ROLE)
    REQUIRED_FIELDS = ["email", "password"]


class ChecklistTemplate(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    json_contents = models.TextField()


class Checklist(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    json_contents = models.TextField()
    template = models.ForeignKey(ChecklistTemplate, related_name="template")

