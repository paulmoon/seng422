from rest_framework import serializers
import server

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = server.models.Employee
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

class ChecklistSerializer(serializers.ModelSerializer):
	class Meta:
		model = server.models.Checklist
		fields = ('id', 'title', 'description', 'json_contents', 'template')

class ChecklistTemplateSerializer(serializers.ModelSerializer):
	class Meta:
		model = server.models.ChecklistTemplate
		fields = ('id', 'title', 'description', 'json_contents')