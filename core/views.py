from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.db import transaction
from .models import Property, Unit, Visit, Payment, Service, Ticket, Notification
from .serializers import (
    UserSerializer, PropertySerializer, UnitSerializer, VisitSerializer,
    PaymentSerializer, ServiceSerializer, TicketSerializer, NotificationSerializer
)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer

    @action(detail=True, methods=['post'])
    def verify_otp(self, request, pk=None):
        visit = self.get_object()
        otp = request.data.get('otp')
        if visit.otp == otp:
            visit.otp_verified = True
            visit.save()
            return Response({'status': 'OTP verified'})
        return Response({'status': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def book(self, request):
        tenant = request.user
        unit_id = request.data.get('unit_id')
        scheduled_at = request.data.get('scheduled_at')
        refundable_fee = request.data.get('refundable_fee', 0)
        try:
            unit = Unit.objects.select_for_update().get(id=unit_id, is_booked=False)
        except Unit.DoesNotExist:
            return Response({'error': 'Unit not available'}, status=400)
        otp = get_random_string(6, allowed_chars='0123456789')
        visit = Visit.objects.create(
            tenant=tenant, unit=unit, scheduled_at=scheduled_at, otp=otp, refundable_fee=refundable_fee
        )
        # Optionally, send OTP notification here
        return Response(VisitSerializer(visit).data, status=201)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    @action(detail=True, methods=['post'])
    def escalate(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'escalated'
        ticket.escalated = True
        ticket.save()
        # Optionally, notify landlord
        return Response({'status': 'Ticket escalated'})

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
