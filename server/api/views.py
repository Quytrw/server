from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework import status
from rest_framework.renderers import JSONRenderer

from .serializers import AccountSerializer, TicketSerializer, ParkingLotSerializer
from .models import Account, Ticket, ParkingLot

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# show all ticket
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def tickets_list(request):
    tickets = Ticket.objects.all()
    serializer = TicketSerializer(tickets, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

#create ticket
@api_view(['POST'])
def create_ticket(request):
    serializer = TicketSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#get ticket for hardware update it
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def get_ticket(request, license_plate):
    try:
        ticket = Ticket.objects.filter(license = license_plate).latest('id')
    except Ticket.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = TicketSerializer(ticket)
    return Response(serializer.data, status=status.HTTP_200_OK)

#update ticket
@api_view(['PUT'])
def update_ticket(request, ticket_id):
    try:
        ticket = Ticket.objects.get(id = ticket_id)
    except Ticket.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = TicketSerializer(ticket, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# login
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        account = Account.objects.get(email=email)
        if account.password == password:
            # Serialize thông tin tài khoản
            serializer = AccountSerializer(account)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
# create account
@api_view(['POST'])
def create_account(request):
    serializer = AccountSerializer(data=request.data)
    if serializer.is_valid():
        account = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#update info
@api_view(['PUT'])
@login_required
def update_info(request, account_id):
    new_name = request.data.get('name')
    new_password = request.data.get('password')
    try:
        account = Account.objects.get(id=account_id)
        account.name = new_name
        account.password = new_password
        account.save()

        return Response(status=status.HTTP_200_OK)

    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
#parking lots list
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def parkinglots_list(request):
    parkinglots = ParkingLot.objects.all()
    serializer = ParkingLotSerializer(parkinglots, many = True)

    return Response(serializer.data, status=status.HTTP_200_OK)


#update status of parking lot
@api_view(['PUT'])
def update_status(request, parkinglot_id):
    try:
        parking_lot = ParkingLot.objects.get(id = parkinglot_id)

        isFree = parking_lot.isfree
        parking_lot.change_status(isFree)  # Call the change_status method
        parking_lot.save()
        serializer = ParkingLotSerializer(parking_lot, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ParkingLot.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
#get account with license
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def get_account(request, license_plate):
    try:
        account = Account.objects.filter(license = license_plate)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = AccountSerializer(account)
    return Response(serializer.data, status=status.HTTP_200_OK)
    