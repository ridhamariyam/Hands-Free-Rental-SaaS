from django.urls import path
from .payments import RazorpayPaymentInitView, RazorpayPaymentVerifyView

urlpatterns = [
    path('razorpay/init/', RazorpayPaymentInitView.as_view(), name='razorpay-init'),
    path('razorpay/verify/', RazorpayPaymentVerifyView.as_view(), name='razorpay-verify'),
]
