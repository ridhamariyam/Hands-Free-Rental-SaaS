from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Property, Unit, Visit, Payment, Service, Ticket, Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'kyc_document', 'first_name', 'last_name']
        read_only_fields = ['id', 'role']

class PropertySerializer(serializers.ModelSerializer):
    landlord = UserSerializer(read_only=True)
    class Meta:
        model = Property
        fields = ['id', 'landlord', 'name', 'address', 'description']

class UnitSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    tenant = UserSerializer(read_only=True)
    class Meta:
        model = Unit
        fields = ['id', 'property', 'name', 'description', 'is_booked', 'tenant']

class VisitSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)
    unit = UnitSerializer(read_only=True)
    class Meta:
        model = Visit
        fields = ['id', 'tenant', 'unit', 'scheduled_at', 'otp', 'otp_verified', 'refundable_fee', 'created_at']
        read_only_fields = ['id', 'otp', 'otp_verified', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)
    unit = UnitSerializer(read_only=True)
    class Meta:
        model = Payment
        fields = ['id', 'tenant', 'unit', 'amount', 'payment_type', 'status', 'payment_gateway_id', 'created_at']
        read_only_fields = ['id', 'status', 'payment_gateway_id', 'created_at']

class ServiceSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    vendor = UserSerializer(read_only=True)
    class Meta:
        model = Service
        fields = ['id', 'property', 'vendor', 'service_type', 'contact_info']

class TicketSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)
    unit = UnitSerializer(read_only=True)
    assigned_vendor = UserSerializer(read_only=True)
    class Meta:
        model = Ticket
        fields = ['id', 'tenant', 'unit', 'description', 'status', 'assigned_vendor', 'cost_estimate', 'created_at', 'escalated']
        read_only_fields = ['id', 'status', 'assigned_vendor', 'created_at', 'escalated']

class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'created_at', 'read']
        read_only_fields = ['id', 'created_at']
