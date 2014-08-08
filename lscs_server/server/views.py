from django.shortcuts import get_object_or_404
from rest_framework import viewsets, generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from models import Employee, ChecklistTemplate, Checklist
from serializers import EmployeeSerializer, ChecklistGetSerializer, ChecklistPostSerializer, EmployeeInfoSerializer
import server
import datetime



class EmployeeViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)
    def list(self, request):
        queryset = Employee.objects.all()
        serializer = EmployeeInfoSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Employee.objects.all()
        employee = get_object_or_404(queryset, pk=pk)
        serializer = EmployeeInfoSerializer(employee)
        return Response(serializer.data)

class EmployeeModifyView(generics.CreateAPIView):
    """
    This view provides an endpoint to modify existing users
    """    
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        if self.request.user.role == 0:
            return Response({"error":"Only admins or the user themself can modify the user"}, status=status.HTTP_403_FORBIDDEN)
        
        employee_id = kwargs['employeeID']
        if self.request.user.role == 2 and self.request.user.id != employee_id:
            return Response({"error":"Cannot modify another surveyor unless an admin"}, status=status.HTTP_403_FORBIDDEN)

        serializer = EmployeeSerializer(data=request.DATA)
        employee = Employee.objects.get(pk=employee_id)
        if 'username' in request.DATA.keys():
            employee.username = serializer.init_data["username"]
        if 'email' in request.DATA.keys():
            employee.email = serializer.init_data["email"]
        if 'first_name' in request.DATA.keys():
            employee.first_name = serializer.init_data["first_name"]
        if 'last_name' in request.DATA.keys():
            employee.last_name = serializer.init_data["last_name"]
        if 'role' in request.DATA.keys():
            employee.role = serializer.init_data["role"]
        if "password" in request.DATA.keys():
            employee.set_password(serializer.init_data["password"])
        employee.save()
        return Response(status=status.HTTP_200_OK)

class RegisterEmployeeView(generics.CreateAPIView):
    """
    This view provides an endpoint for new users to register.
    """
    permission_classes = (AllowAny,)
    serializer_class = EmployeeSerializer

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

class UserInformationView(generics.RetrieveAPIView):
    """
    Given a token, it will return the user's information
    """
    authentication_classes = (TokenAuthentication,)
    serializer_class = EmployeeInfoSerializer

    def get_object(self):
        return Employee.objects.get(pk=self.request.user.id)

class ChecklistModify(generics.ListCreateAPIView):
    """
    The ChecklistModify view allows manager to modify checklist infomation
    when providing the id of the checklist.

    POST - provided the id of the checklist, modify all information relate to it.
    """
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChecklistGetSerializer

    def get(self, request, *args, **kwargs):
        checklistID = int(kwargs["checklistID"])
        try:
            checklist = Checklist.objects.get(pk=checklistID)
            serializer = ChecklistSerializer(checklist)
            return Response(serializer.data, status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response("Checklist with id {} does not exist.".format(
                checklistID), status.HTTP_404_NOT_FOUND)


    def post(self, request, *args, **kwargs):
        if request.user.role == '0':
            return Response({"error":"Only managers can modify checklists"}, status=status.HTTP_403_FORBIDDEN)
        serializer = ChecklistPostSerializer(data=request.DATA);
        if serializer.is_valid():
            checklist = Checklist.objects.get(pk=kwargs['checklistID'])
            if request.user.role == '1':
                checklist.title = serializer.data["title"]
                checklist.description = serializer.data["description"]
                checklist.assignee = Employee.objects.get(pk=serializer.data["assignee"])
                checklist.address = serializer.data["address"]
                checklist.district = serializer.data["district"]
                checklist.date=datetime.date.today()
            checklist.json_contents = serializer.data["json_contents"]
            checklist.save()
            return Response('update')
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChecklistView(generics.ListCreateAPIView):
    """
    This view provides an endpoint for displaying checklists for land surveyors and managers, and the 
    ability for managers to create new checklists
    
    GET - Returns all checklists where the manager is the assigner in a list format
    {
        [
            checklist1, 
            checklist2
        ]
    }

    POST - Creates a new checklist setting the manager as the assignee.

    """
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChecklistGetSerializer

    def get_queryset(self):
        if self.request.user.role == '2':
            queryset = Checklist.objects.filter(assignee=self.request.user)
        elif self.request.user.role == '1':
            queryset = Checklist.objects.filter(assigner=self.request.user)
        else:
            queryset = None
        return queryset

    def post(self, request, *args, **kwargs):
        """
        This post will create a new checklist with the manager as the assignee.
        TODO: It currently does not take into account templating
        """
        if request.user.role != '1':
            return Response({"error":"Only managers can create new checklists"}, status=status.HTTP_403_FORBIDDEN)
        serializer = ChecklistPostSerializer(data=request.DATA)
        if serializer.is_valid():
            checklist = Checklist.objects.create(
                    title=serializer.data["title"],
                    description=serializer.data["description"],
                    json_contents=serializer.data["json_contents"],
                    template=ChecklistTemplate.objects.get(pk=serializer.data["template"]),
                    assignee=Employee.objects.get(pk=serializer.data["assignee"]),
                    assigner=request.user,
                    address=serializer.data["address"],
                    district=serializer.data["district"],
                    date=datetime.date.today()
                )
            checklist.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChecklistTemplateView(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    serializer_class = server.serializers.ChecklistTemplateSerializer
    '''
    GET - /template/?$
    Return a set of Templates for the corresponding user that are active
    '''
    def get_queryset(self):
        #Return only the currently active checklists
        return ChecklistTemplate.objects.filter(status='A', owner=self.request.user)
    
    '''
    POST - /template/?$
    Create a Checklist Template
    '''
    def post(self, request, *args, **kwargs):
        if request.user.role != '1':
            return Response(data={"Forbidden":request.user.role}, status=status.HTTP_403_FORBIDDEN)
        serializer = server.serializers.ChecklistTemplateSerializer(data=request.DATA)
        if(serializer.is_valid()):  
            checklist_template = ChecklistTemplate.objects.create(
                title=serializer.data["title"],
                description=serializer.data["description"],
                json_contents=serializer.data["json_contents"],
                status=serializer.data["status"],
                owner=request.user
            )
            checklist_template.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ChecklistTemplateUpdateView(generics.UpdateAPIView):
    #TODO: Change for Authenication
    authentication_classes = (TokenAuthentication,)
    '''
    PUT - /template/(?P<templateID>\d+)/?$
    Update a checklist template
    '''
    def put(self, request, *args, **kwargs):
        template = None
        try:
            template = ChecklistTemplate.objects.get(pk=kwargs['templateID'])
        except KeyError:
            return Response("No template exists with that ID!")

        serializer = server.serializers.ChecklistTemplateSerializer(data=request.DATA)
        if(serializer.is_valid()):
            #update the fields provided
            if('title' in request.DATA.keys()):
                template.title = serializer.init_data['title']
            if('description' in request.DATA.keys()):
                template.description = serializer.init_data['description']
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
    authentication_classes = (TokenAuthentication,)
    '''
    DELETE - /template/(?P<templateID>\d+)/?$
    Delete a checklist provided its templateID. In our
    case we just mark the case as deactive.
    '''
    def delete(self, request, *args, **kwargs):
        template = None
        try:
            template = ChecklistTemplate.objects.get(pk=kwargs['templateID'])
        except KeyError:
            HttpResponseServerError("No template exists with that ID!")

        if(serializer.is_valid()):
            if('status' in request.DATA.keys()):
                template.status = ChecklistTemplate.STATUS[1][0] #Disabled status.
            template.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChecklistStatusChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    def post(self, request, *args, **kwargs):
        checklist = Checklist.objects.get(pk=kwargs['checklistID'])
        checklist.status = request.DATA['status']
        checklist.save();
        return Response("Checklist updated with status " + request.DATA['status'])

class ChecklistDeleteView(generics.DestroyAPIView):
    permission_classes = (AllowAny,)

    def delete(self, request, *args, **kwargs):
        checklist = Checklist.objects.get(pk=kwargs['checklistID'])
        checklist.delete();
        return Response("Checklist deleted")

class EmployeeSurveyorView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = EmployeeInfoSerializer

    def get_queryset(self):
        return Employee.objects.filter(role='2')

