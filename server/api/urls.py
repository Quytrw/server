from django.urls import path, include
from api import views
from . import routing

urlpatterns = [
    path('tickets/', views.tickets_list),
    path('tickets/create/', views.create_ticket),
    path('tickets/get/<str:license_plate>/', views.get_ticket),
    path('tickets/update/<str:ticket_id>/', views.update_ticket),
    
    path('accounts/login/', views.login),
    path('accounts/create/', views.create_account),
    path('accounts/update/<str:account_id>/', views.update_info),

    path('parkinglots/', views.parkinglots_list),
    path('parkinglots/update/<str:parkinglot_id>/', views.update_status),

    path('accounts/<str:license_plate>/', views.get_account),

]

