from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tag(models.Model):
  name = models.CharField(max_length=50, unique=True)

  def __str__(self): 
    return self.name 

class Item(models.Model):
  owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="items")
  title = models.CharField(max_length=120)
  description = models.TextField(blank=True)
  tags = models.ManyToManyField(Tag, blank=True, related_name="items")
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self): 
    return self.title
  
class Favorite(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
  item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="favorited_by")
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ("user", "item")