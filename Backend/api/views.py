from rest_framework.decorators import action
from django.db.models import Sum, Count
from django.utils import timezone
from .models import User, Category, Dish, Table, Order, OrderItem, Earning
from .serializers import (
    UserSerializer, 
    CategorySerializer, 
    DishSerializer, 
    TableSerializer, 
    OrderSerializer, 
    OrderItemSerializer, 
    EarningSerializer,
)
# -------------------------------------------------------------------
from api import serializers as api_serializers
from userauth.models import User, Profile

from rest_framework import viewsets, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import pytz

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializers.MyTokenObtainPairSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class()
        return Response(serializer.data, status=status.HTTP_200_OK)

# this view handles user registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # AllowAny means all authenticated or unauthenticated users can access this view
    serializer_class = api_serializers.RegisterSerializer

# function to generate a random OTP
def generate_otp(length):
    import random

    otp = "".join([str(random.randint(0, 9)) for _ in range(length)])
    return otp

# this view handles sending OTP to email for password reset
class PasswordResetEmailVerifyAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializers.UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        if not user:
            raise NotFound("User with this email does not exist")
            
        if user:
            user.otp = generate_otp(6)
            user.save()
            
            context = {
                'otp': user.otp,
                'user': user,
            }

            subject = 'DineEase Password Reset Request'
            text_body = render_to_string('email/password_reset.txt', context)
            html_body = render_to_string('email/password_reset.html', context)

            msg = EmailMultiAlternatives(
                subject = subject,
                from_email = settings.DEFAULT_FROM_EMAIL,
                to = [user.email],
                body = text_body
            )

            msg.attach_alternative(html_body, "text/html")
            msg.send()
            
        return Response({"detail": "Password reset OTP has been sent to your email."}, status=status.HTTP_200_OK)

class OTPVerificationAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializers.UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')

        user = User.objects.filter(email=email, otp=otp).first()

        if user:
            return Response({"detail": "OTP verification successful."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid OTP or email."}, status=status.HTTP_400_BAD_REQUEST)

# this view handles changing password reset using OTP
class PasswordChangeAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializers.UserSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')
        password = request.data.get('password')

        user = User.objects.filter(email=email, otp=otp).first() 
        if user:
            user.set_password(password)
            user.otp = ""  # Clear the OTP after successful password reset
            user.save()

            # Send password change confirmation email
            now_utc = timezone.now()
            ist = pytz.timezone('Asia/Kolkata')
            now_ist = now_utc.astimezone(ist)
            context = {
                'user': user,
                'timestamp': now_ist.strftime('%B %d, %Y at %I:%M %p %Z')
            }

            subject = 'Your DineEase Password Has Been Changed'
            text_body = render_to_string('email/password_changed.txt', context)
            html_body = render_to_string('email/password_changed.html', context)

            msg = EmailMultiAlternatives(
                subject=subject,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
                body=text_body
            )

            msg.attach_alternative(html_body, "text/html")
            msg.send()

            return Response({"detail": "Password reset successful."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Invalid OTP or user."}, status=status.HTTP_400_BAD_REQUEST)


# ======================================================================================================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'], url_path='profile')
    def profile(self, request):
        # Assuming the user is authenticated
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @profile.mapping.put
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    @action(detail=True, methods=['post'])
    def book(self, request, pk=None):
        table = self.get_object()
        if table.status != 'Available':
            return Response({'error': 'Table is not available for booking'}, status=status.HTTP_400_BAD_REQUEST)
        
        customer_name = request.data.get('customer_name')
        booking_time = request.data.get('booking_time')

        if not customer_name or not booking_time:
            return Response({'error': 'Customer name and booking time are required'}, status=status.HTTP_400_BAD_REQUEST)

        table.status = 'Booked'
        table.customer_name = customer_name
        table.booking_time = booking_time
        table.save()
        return Response(self.get_serializer(table).data)

    @action(detail=True, methods=['post'])
    def free(self, request, pk=None):
        table = self.get_object()
        table.status = 'Available'
        table.customer_name = None
        table.booking_time = None
        table.save()
        return Response(self.get_serializer(table).data)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        order = serializer.save()
        if order.table:
            order.table.status = 'Occupied'
            order.table.save()

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class EarningViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Earning.objects.all()
    serializer_class = EarningSerializer

    @action(detail=False, methods=['get'], url_path='performance')
    def performance(self, request):
        today = timezone.now().date()
        
        # Revenue
        revenue = Order.objects.filter(created_at__date=today).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Total Customers (assuming one order per customer for simplicity)
        total_customers = Order.objects.filter(created_at__date=today).values('customer_name').distinct().count()
        
        # Event Count (assuming this means orders)
        event_count = Order.objects.filter(created_at__date=today).count()
        
        # Sales Details (example for the last 30 days)
        sales_details = Order.objects.filter(created_at__date__gte=today - timezone.timedelta(days=30)) \
            .values('created_at__date') \
            .annotate(daily_total=Sum('total_amount')) \
            .order_by('created_at__date')

        # Today's Performance
        today_earning = revenue
        in_progress_orders = Order.objects.filter(status='In Progress').count()
        total_dishes_ordered = OrderItem.products.filter(order__created_at__date=today).aggregate(total=Sum('quantity'))['total'] or 0
        active_orders = Order.objects.filter(status__in=['Pending', 'In Progress']).count()

        # Recent Orders
        recent_orders = OrderSerializer(Order.objects.order_by('-created_at')[:5], many=True).data

        # Popular Dishes
        popular_dishes = OrderItem.objects.values('dish__name') \
            .annotate(count=Count('id')) \
            .order_by('-count')[:5]

        return Response({
            'overall_performance': {
                'revenue': revenue,
                'total_customer': total_customers,
                'event_count': event_count,
            },
            'sales_details': sales_details,
            'todays_performance': {
                'today_earning': today_earning,
                'in_progress': in_progress_orders,
                'total_customer': total_customers, # This is duplicated, but matches the UI
                'total_dishes': total_dishes_ordered,
                'active_orders': active_orders,
            },
            'recent_orders': recent_orders,
            'popular_dishes': popular_dishes,
        })
