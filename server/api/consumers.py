from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TicketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'ticket_updates'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def ticket_update(self, event):
        ticket = event['ticket']
        await self.send(json.dumps({
            'type': 'ticket.update',
            'ticket': ticket
        }))

class ParkingLotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'parkinglot_updates'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def parkinglot_update(self, event):
        parkinglot = event['parkinglot']
        await self.send(json.dumps({
            'type': 'parkinglot.update',
            'parkinglot': parkinglot
        }))
