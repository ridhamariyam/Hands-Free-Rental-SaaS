
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, PropertyViewSet, UnitViewSet, VisitViewSet,
    PaymentViewSet, ServiceViewSet, TicketViewSet, NotificationViewSet,
    register, profile
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'units', UnitViewSet)
router.register(r'visits', VisitViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'notifications', NotificationViewSet)


from django.urls import path

urlpatterns = [
    path('auth/register/', register, name='register'),
    path('auth/profile/', profile, name='profile'),
]
urlpatterns += router.urls
