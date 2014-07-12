from django.conf.urls import patterns, include, url

from django.contrib import admin
from rest_framework import routers
from server import views

admin.autodiscover()

router = routers.DefaultRouter()
router.register(r'employees', views.EmployeeViewSet, base_name='employees')

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^api-auth/?', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^verify_credentials/?', 'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^register/', views.RegisterEmployeeView.as_view()),
    url(r'^admin/', include(admin.site.urls)),
)
