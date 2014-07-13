from django.shortcuts import get_object_or_404
from rest_framework import viewsets, generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from models import Employee
from serializers import EmployeeSerializer, ChecklistSerializer
from models import Checklist
import server



class EmployeeViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Employee.objects.all()
        serializer = EmployeeSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Employee.objects.all()
        employee = get_object_or_404(queryset, pk=pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)

class RegisterEmployeeView(generics.CreateAPIView):
    """
	This view provides an endpoint for new users to register.
	"""
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = EmployeeSerializer(data=request.DATA)
        if serializer.is_valid():
            employee = Employee.objects.create_user(
				username=serializer.init_data["username"],
				password=serializer.init_data["password"],
				email=serializer.init_data["email"],
			)
            employee.save()
            token, created = Token.objects.get_or_create(user=employee)
            return Response(data={'token':token.key}, status=200)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ChecklistView(generics.CreateAPIView):
    """
    This view provides an endpoint for displaying checklists.
    """
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        cl = Checklist.objects.all()
        serializer = ChecklistSerializer(cl, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ChecklistSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)