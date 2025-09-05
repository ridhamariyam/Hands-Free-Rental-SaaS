from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
        ('security', 'Security'),
        ('vendor', 'Vendor'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    kyc_document = models.FileField(upload_to='kyc_docs/', null=True, blank=True)  # Only for tenants
    # Add vendor-specific fields if needed

class Property(models.Model):
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    name = models.CharField(max_length=255)
    address = models.TextField()
    description = models.TextField(blank=True)

class Unit(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='units')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_booked = models.BooleanField(default=False)
    tenant = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='rented_units')

class Visit(models.Model):
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visits')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='visits')
    scheduled_at = models.DateTimeField()
    otp = models.CharField(max_length=6)
    otp_verified = models.BooleanField(default=False)
    refundable_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    PAYMENT_TYPE_CHOICES = [
        ('rent', 'Rent'),
        ('advance', 'Advance'),
        ('emi', 'EMI'),
        ('visit_fee', 'Visit Fee'),
    ]
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    status = models.CharField(max_length=20, default='pending')
    payment_gateway_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Service(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('gas', 'Gas'),
        ('internet', 'Internet'),
        ('water', 'Water'),
        ('cleaning', 'Cleaning'),
        # Add more as needed
    ]
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='services')
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    contact_info = models.CharField(max_length=255)

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('assigned', 'Assigned'),
        ('closed', 'Closed'),
        ('escalated', 'Escalated'),
    ]
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='tickets')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    assigned_vendor = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_tickets')
    cost_estimate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    escalated = models.BooleanField(default=False)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
