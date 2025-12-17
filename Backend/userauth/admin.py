from django.contrib import admin
from .models import User, Profile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'email',
        'first_name',
        'last_name',
        'is_staff',
        'is_active',
    )
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_active')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'date_created')
    search_fields = ('user__email', 'phone')
