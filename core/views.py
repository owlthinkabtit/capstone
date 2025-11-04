from django.shortcuts import render
from rest_framework import viewsets, permissions, decorators, response, status
from django.db.models import Count
from .models import Item, Tag, Favorite
from .serializers import ItemSerializer, TagSerializer

# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.method in permissions.SAFE_METHODS: return True
    return getattr(obj, "owner_id", None) == request.user.id
  
class ItemViewSet(viewsets.ModelViewSet):
  queryset = Item.objects.all().select_related("owner").prefetch_related("tags")
  serializer_class = ItemSerializer
  permission_classes = [IsOwnerOrReadOnly]

  def get_queryset(self):
    qs = super().get_queryset()
    tag = self.request.query_params.get("tag")
    if tag: qs = qs.filter(tags__name__iexact=tag)
    return qs.order_by("created_at")
  
  def perform_create(self, serializer):
    serializer.save(owner=self.request.user)
  
  @decorators.action(detail=True, methods=["post"])
  def favorite(self, request, pk=None):
    item = self.get_object()
    Favorite.objects.get_or_create(user=request.user, item=item)
    return response.Response({"ok": True})
  
  @decorators.action(detail=True, methods=["post"])
  def unfavorite(self, request, pk=None):
    item = self.get_object()
    Favorite.objects.filter(user=request.user, item=item).delete()
    return response.Response({"ok": True})
  
class TagViewSet(viewsets.ModelViewSet):
  queryset = Tag.objects.all().order_by("name")
  serializer_class = TagSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@decorators.api_view(["GET"])
def stats(request):
  by_tag = Tag.objects.annotate(count=Count("Items")).values("name","count").order_by("-count")
  return response.Response({"by_tag": list(by_tag)})