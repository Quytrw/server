from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Ticket, ParkingLot
from .serializers import TicketSerializer, ParkingLotSerializer

@receiver(post_save, sender=Ticket)
def send_ticket_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'ticket_updates',
        {
            'type': 'ticket.update',
            'ticket': TicketSerializer(instance).data
        }
    )

@receiver(post_save, sender=ParkingLot)
def send_parkinglot_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'parkinglot_updates',
        {
            'type': 'parkinglot_update',
            'parkinglot': ParkingLotSerializer(instance).data
            
        }
    )
