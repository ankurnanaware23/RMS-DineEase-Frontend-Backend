from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='user'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='user'
    )
    # Add any other user-related fields here

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Dish(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.ForeignKey(Category, related_name='dishes', on_delete=models.CASCADE)
    is_veg = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Table(models.Model):
    STATUS_CHOICES = (
        ('Available', 'Available'),
        ('Occupied', 'Occupied'),
        ('Booked', 'Booked'),
    )
    table_number = models.CharField(max_length=10, unique=True)
    seats = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Available')
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    booking_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.table_number

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Ready', 'Ready'),
        ('Completed', 'Completed'),
    )
    ORDER_TYPE_CHOICES = (
        ('Dine In', 'Dine In'),
        ('Takeaway', 'Takeaway'),
    )
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True)
    customer_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    order_type = models.CharField(max_length=10, choices=ORDER_TYPE_CHOICES, default='Dine In')
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Order {self.id} for {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2) # Price at the time of order

    def __str__(self):
        return f"{self.quantity} x {self.dish.name} in Order {self.order.id}"

class Earning(models.Model):
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Earnings on {self.date}: {self.amount}"
