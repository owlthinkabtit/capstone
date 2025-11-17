from rest_framework import serializers
from .models import Movie, Genre, Watchlist
from django.contrib.auth.models import User

from rest_framework import serializers
from .models import Movie, Genre, Watchlist

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    in_watchlist = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "release_year",
            "rating",
            "poster_url",
            "description",
            "runtime_minutes",
            "director",
            "genres",
            "in_watchlist",
        ]

    def get_in_watchlist(self, obj):
        request = getattr(self, "context", {}).get("request")
        if not request or not getattr(request, "user", None) or not request.user.is_authenticated:
            return False
        return Watchlist.objects.filter(user=request.user, movie=obj).exists()

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="profile.display_name", read_only=True)
    avatar_url = serializers.URLField(source="profile.avatar_url", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "display_name", "avatar_url"]