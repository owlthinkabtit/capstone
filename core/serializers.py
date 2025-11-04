from rest_framework import serializers
from .models import Item, Tag, Favorite 

class TagSerializer(serializers.ModelSerializer):
  class Meta:
    model = Tag
    fields = ["id", "name"]

class ItemSerializer(serializers.ModelSerializer):
  tags = TagSerializer(many=True, read_only=True)
  tag_ids = serializers.PrimaryKeyRelatedField(
    queryset =Tag.objects.all(), many=True, write_only=True, source="tags"
  )
  is_favorited = serializers.SerializerMethodField()

  class Meta:
    model = Item
    fields = ["id", "title", "description", "tags", "tag_ids", "created_at", "is_favorited" ]

  def get_is_favorited(self, obj):
    user = self.context["request"].user
    if not user.is_authenticated:
      return False
    return obj.favorited_by.filter(user=user).exists()
  
  def create(self, validated_data):
    user = self.context["request"].user
    item = Item.objects.create(owner=user, **{k:v for k,v in validated_data.items() if k != "tags"})
    if "tags" in validated_data:
      item.tags.set(validated_data["tags"])
    return item
  
  def update(self, instance, validated_data):
    if "tags" in validated_data:
      instance.tags.set(validated_data["tags"])
    return super().update(instance, {k:v for k,v in validated_data.items() if k != "tags"})