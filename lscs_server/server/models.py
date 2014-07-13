from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.db import models

ROLE = (
    ('0', 'ADMIN'),
    ('1', 'MANAGER'),
    ('2', 'SURVEYOR'),
)


class Employee(AbstractUser):
    role = models.CharField(max_length=1, choices=ROLE)
    REQUIRED_FIELDS = ["email", "password"]


@receiver(post_save, sender=Employee)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class ChecklistTemplate(models.Model):
    STATUS = (
        ('A', 'Active'),
        ('D', 'Disabled'),
    )

    title = models.CharField(max_length=100)
    description = models.TextField()

    status = models.CharField(max_length=1, choices=STATUS)
    json_contents = models.TextField()


class Checklist(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    json_contents = models.TextField()
    assignee = models.ForeignKey(Employee, related_name="assignee")
    template = models.ForeignKey(ChecklistTemplate, related_name="template")

