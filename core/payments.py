import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Payment
from .serializers import PaymentSerializer

# Razorpay client initialization (add your keys in Django settings)
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class RazorpayPaymentInitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        currency = 'INR'
        receipt = request.data.get('receipt', 'receipt#1')
        notes = request.data.get('notes', {})
        try:
            order = razorpay_client.order.create({
                'amount': int(float(amount) * 100),  # Razorpay expects paise
                'currency': currency,
                'receipt': receipt,
                'notes': notes
            })
            return Response({'order': order}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class RazorpayPaymentVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # This endpoint should be called after payment is completed on frontend
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        try:
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
            # Mark payment as successful in your DB
            payment = Payment.objects.get(payment_gateway_id=order_id)
            payment.status = 'success'
            payment.save()
            return Response({'status': 'Payment verified'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
