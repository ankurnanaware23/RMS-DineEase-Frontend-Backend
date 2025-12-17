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
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
