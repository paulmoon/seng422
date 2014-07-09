from django.contrib.auth.models import User, AbstractUser

from django.db import models

ROLE = (
    (0, 'ADMIN'),
    (1, 'MANAGER'),
    (2, 'SURVEYOR'),
)

class Employee(AbstractUser):
    role = models.CharField(max_length=1, choices=ROLE)

