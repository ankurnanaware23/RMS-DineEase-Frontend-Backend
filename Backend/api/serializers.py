from rest_framework import serializers
from .models import User, Category, Dish, Table, Order, OrderItem, Earning

# -------------------------------------------------------------------
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from userauth.models import User, Profile
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name")

class UserProfileSerializer(serializers.ModelSerializer):
    phone = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'phone')

    def get_phone(self, obj):
        """
        Safely get the phone number from the user's profile, creating a profile if it doesn't exist.
        """
        profile, created = Profile.objects.get_or_create(user=obj)
        return profile.phone if profile.phone else ""

    def update(self, instance, validated_data):
        """
        Update user instance and their profile.
        The 'phone' number is extracted directly from the request context
        as SerializerMethodField is read-only.
        """
        # Ensure profile exists
        profile, created = Profile.objects.get_or_create(user=instance)
        
        # Get phone from request data, since 'phone' is read-only in the serializer
        phone = self.context['request'].data.get('phone')

        # Update User model fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        # Update Profile model field if phone is provided
        if phone is not None:
            profile.phone = phone
            profile.save()

        return instance

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Store the latest refresh token on login
        refresh = data.get("refresh")
        if refresh:
            self.user.refresh_token = refresh
            self.user.save(update_fields=["refresh_token"])
        return data

class MyTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Store the latest refresh token after rotation
        new_refresh = data.get("refresh") or attrs.get("refresh")
        if new_refresh:
            try:
                token = RefreshToken(new_refresh)
                user_id = token.get("user_id")
                if user_id:
                    User.objects.filter(id=user_id).update(refresh_token=new_refresh)
            except Exception:
                pass
        return data
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']

    def validate(self, attrs):
        if User.objects.filter(email=attrs.get('email')).exists():
            raise serializers.ValidationError(
                {"email": "This email is already registered."}
            )
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match"}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        user.set_password(password)
        user.save()
        return user

# -------------------------------------------------------------------

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.ReadOnlyField(source='dish.name')

    class Meta:
        model = OrderItem
        fields = ('id', 'dish', 'dish_name', 'quantity', 'price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ('id', 'table', 'customer_name', 'status', 'order_type', 'created_at', 'total_amount', 'items')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        total_amount = 0
        for item_data in items_data:
            dish = item_data['dish']
            quantity = item_data['quantity']
            price = dish.price * quantity
            total_amount += price
            OrderItem.objects.create(order=order, **item_data, price=price)
        order.total_amount = total_amount
        order.save()
        return order

class EarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Earning
        fields = '__all__'
