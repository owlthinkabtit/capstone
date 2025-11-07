from rest_framework import serializers
from .models import Movie, Genre, Watchlist
from django.contrib.auth.models import User

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(), many=True, write_only=True, source="genres"
    )
    in_watchlist = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "description",
            "release_year",
            "poster_url",
            "rating",
            "genres",
            "genre_ids",
            "in_watchlist",
            "created_at",
        ]

    def get_in_watchlist(self, obj):
        user = self.context["request"].user
        if not user.is_authenticated:
            return False
        return obj.in_watchlists.filter(user=user).exists()

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="profile.display_name", read_only=True)
    avatar_url = serializers.URLField(source="profile.avatar_url", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "display_name", "avatar_url"]