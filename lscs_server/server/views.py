from django.shortcuts import get_object_or_404
from rest_framework import viewsets, generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from models import Employee, ChecklistTemplate, Checklist
from serializers import EmployeeSerializer, ChecklistSerializer
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
                first_name=serializer.init_data["first_name"],
                last_name=serializer.init_data["last_name"],
                role=serializer.init_data["role"],
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
    permission_classes = (tokenauthentication,)

    def get(self, request, *args, **kwargs):
        #?????????
        cl = Checklist.objects.filter(request.user)
        serializer = ChecklistSerializer(cl, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ChecklistSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChecklistTemplateListView(generics.ListAPIView):
    authentication_classes = (AllowAny,)
    '''
    GET - /template/?$
    Return a set of Templates for the 
    '''
    def get_queryset(self, request, *args, **kwargs):
        #Return only the currently active checklists
        return ChecklistTemplate.objects.filter(checklisttemplate__status='A')


class ChecklistTemplateCreateView(generics.CreateAPIView):
    #TODO: Change for Authentication
    authentication_classes = (AllowAny,)
    '''
    POST - /template/?$
    Create a Checklist Template
    '''
    def post(self, request, *args, **kwargs):
        serializer = server.serializers.ChecklistTemplateSerializer(fields=request.DATA.keys(), data=request.DATA)
        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChecklistTemplateUpdateView(generics.UpdateAPIView):
    #TODO: Change for Authenication
    authentication_classes = (AllowAny,)
    '''
    PUT - /template/(?P<templateID>\d+)/?$
    Update a checklist template
    '''
    def put(self, request, *args, **kwargs):
        template = None
        try:
            template = ChecklistTemplates.objects.get(pk=request.DATA['id'])
        except KeyError:
            HttpResponseServerError("No template exists with that ID!")

        serializer = server.serializers.ChecklistTemplateSerializer(fields=request.DATA.keys(), data=request.DATA)
        if(serializer.is_valid()):
            #update the fields provided
            if('title' in request.DATA.keys()):
                template.title = serializer.init_data['title']
            if('description' in request.DATA.keys()):
                template.description = serializer.init_data['descroption']
            if('json_contents' in request.DATA.keys()):
                template.json_contents = serializer.init_data['json_contents']
            if('status' in request.DATA.keys()):
                template.status = serializer.init_data['status']
            template.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChecklistTemplateDeactivateView(generics.DestroyAPIView):
    #TODO: Change for authentication
    authentication_classes = (AllowAny,)
    '''
    DELETE - /template/(?P<templateID>\d+)/?$
    Delete a checklist provided its templateID. In our
    case we just mark the case as deactive.
    '''
    def delete(self, request, *args, **kwargs):
        template = None
        try:
            template = ChecklistTemplates.objects.get(pk=request.DATA['id'])
        except KeyError:
            HttpResponseServerError("No template exists with that ID!")

        if(serializer.is_valid()):
            if('status' in request.DATA.keys()):
                template.status = ChecklistTemplate.STATUS[1][0] #Disabled status.
            template.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

