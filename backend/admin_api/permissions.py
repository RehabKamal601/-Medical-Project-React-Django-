from rest_framework.permissions import BasePermission

class IsRoleAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'
