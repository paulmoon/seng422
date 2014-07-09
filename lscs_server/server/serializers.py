from rest_framework import serializers
import server

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = server.models.Employee
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

