from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    CategoryViewSet, 
    DishViewSet, 
    TableViewSet, 
    OrderViewSet, 
    OrderItemViewSet, 
    EarningViewSet
)

# -------------------------------------------------------------------
from api import views as api_views
from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

# -------------------------------------------------------------------

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'dishes', DishViewSet)
router.register(r'tables', TableViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'earnings', EarningViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # -------------------------------------------------------------------
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='Token Obtain Pair View'),
    path('user/token/refresh/',TokenRefreshView.as_view(), name="Token Refresh View"),
    path('user/register/', api_views.RegisterView.as_view(), name="User Registration View"),
    path('user/password-reset/<email>/', api_views.PasswordResetEmailVerifyAPIView.as_view(), name="User Registration View"),
    path('user/password-change/', api_views.PasswordChangeAPIView.as_view(), name="User Registration View")
]
