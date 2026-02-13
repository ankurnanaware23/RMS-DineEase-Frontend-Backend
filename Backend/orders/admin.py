from django.contrib import admin
from .models import Order, OrderItem, Earning


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'table', 'status', 'order_type', 'total_amount', 'created_at')
    list_filter = ('status', 'order_type')
    search_fields = ('customer_name',)
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'dish', 'quantity', 'price')
    list_filter = ('order',)


@admin.register(Earning)
class EarningAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'amount')
