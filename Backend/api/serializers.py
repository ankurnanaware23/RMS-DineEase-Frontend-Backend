from rest_framework import serializers
from .models import User, Category, Dish, Table, Order, OrderItem, Earning

# -------------------------------------------------------------------
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer  
from userauth.models import User, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # this line tells which model to use
        fields = ("id", "email", "first_name", "last_name") # fields to be included in the serialization

        # this makes first_name and last_name required fields
        extra_kwargs = {
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
        }

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fileds = "__all__"

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        return token
    

# -------------------------------------------------------------------

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'phone_number')

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


