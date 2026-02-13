from rest_framework import serializers
from .models import Order, OrderItem, Earning


class OrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.ReadOnlyField(source='dish.name')

    class Meta:
        model = OrderItem
        fields = ('id', 'dish', 'dish_name', 'quantity', 'price')
        read_only_fields = ('price',)


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

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # Update order fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        total_amount = instance.total_amount

        if items_data is not None:
            # Replace items completely
            instance.items.all().delete()
            total_amount = 0
            for item_data in items_data:
                dish = item_data['dish']
                quantity = item_data['quantity']
                price = dish.price * quantity
                total_amount += price
                OrderItem.objects.create(order=instance, **item_data, price=price)

        instance.total_amount = total_amount
        instance.save()
        return instance


class EarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Earning
        fields = '__all__'
