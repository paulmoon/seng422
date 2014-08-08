from django.conf.urls import patterns, include, url

from django.contrib import admin
from rest_framework import routers
from server import views

admin.autodiscover()

router = routers.DefaultRouter()
router.register(r'employees', views.EmployeeViewSet, base_name='employees')

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^api-auth/?$', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^verify_credentials/?$', 'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^authorize_token/?$', views.UserInformationView.as_view()),
    url(r'^register/?$', views.RegisterEmployeeView.as_view()),
    url(r'^admin/?$', include(admin.site.urls)),
    url(r'^checklist/?$', views.ChecklistView.as_view()),
    url(r'^checklist/(?P<checklistID>[0-9]+)/?$', views.ChecklistModify.as_view()),
    url(r'^template/?$', views.ChecklistTemplateView.as_view()),
    url(r'^template/(?P<templateID>[0-9]+)/?$', views.ChecklistTemplateUpdateView.as_view()),
    url(r'^template/(?P<templateID>[0-9]+)/?$', views.ChecklistTemplateDeactivateView.as_view()),
    url(r'^employee/(?P<employeeID>[0-9]+)/?$', views.EmployeeModifyView.as_view()),
    url(r'^checklist/(?P<checklistID>[0-9]+)/status/?$', views.ChecklistStatusChangeView.as_view()),
    url(r'^checklist/(?P<checklistID>[0-9]+)/delete/?$', views.ChecklistDeleteView.as_view()),
    url(r'^surveyors/?$', views.EmployeeSurveyorView.as_view())
)

