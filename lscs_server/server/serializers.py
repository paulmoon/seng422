from django.core.exceptions import ValidationError
from rest_framework import serializers
import server


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = server.models.Employee
        fields = ('id', 'username', 'email', 'password', 'first_name',
                  'last_name', 'role')

    def validate(self, attrs):
        # Ensure that the username and/or email doesn't already exist.

        if server.models.Employee.objects.filter(username=attrs['username']).exists():
            raise ValidationError("username")
        elif server.models.Employee.objects.filter(email=attrs["email"]).exists():
            raise ValidationError("email")
        else:
            return attrs


class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = server.models.Checklist
        fields = ('id', 'title', 'description', 'json_contents', 'template')


class ChecklistTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = server.models.ChecklistTemplate
        fields = ('id', 'title', 'description', 'json_contents')