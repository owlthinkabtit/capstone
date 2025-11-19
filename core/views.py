from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.middleware.csrf import get_token

from rest_framework import response, status, viewsets, permissions, decorators
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Movie, Genre, Watchlist
from .pagination import MoviePagination
from .serializers import (
    MovieSerializer,
    GenreSerializer,
    UserSerializer,
)


class MovieViewSet(viewsets.ModelViewSet):
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = MoviePagination

    def get_queryset(self):
        qs = Movie.objects.all().prefetch_related("genres")

        genre = self.request.query_params.get("genre")
        q = self.request.query_params.get("q", "").strip()
        sort = self.request.query_params.get("sort", "").strip()

        if genre:
            qs = qs.filter(genres__name__iexact=genre)
        if q:
            qs = qs.filter(title__icontains=q)  

        # sorting
        if sort == "rating":
            qs = qs.order_by("-rating", "-id")
        elif sort == "year":
            qs = qs.order_by("-release_year", "-id") 
        elif sort == "title": 
            qs = qs.order_by("title", "-id") 
        else:
            qs = qs.order_by("-id")

        return qs

    def perform_create(self, serializer):
        serializer.save()

    @decorators.action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def add_to_watchlist(self, request, pk=None):
        movie = self.get_object()
        Watchlist.objects.get_or_create(user=request.user, movie=movie)
        return response.Response({"in_watchlist": True})

    @decorators.action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def remove_from_watchlist(self, request, pk=None):
        movie = self.get_object()
        Watchlist.objects.filter(user=request.user, movie=movie).delete()
        return response.Response({"in_watchlist": False})


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all().order_by("name")
    serializer_class = GenreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@decorators.api_view(["GET"])
def stats(request):
    data = Genre.objects.annotate(count=Count("movies")).values("name", "count")
    return response.Response({"by_genre": list(data)})


@ensure_csrf_cookie
@api_view(["GET"])
def me(request):
    if not request.user.is_authenticated:
        return response.Response({"user": None})
    return response.Response({"user": UserSerializer(request.user).data})

@ensure_csrf_cookie
@csrf_protect
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")
    email = request.data.get("email", "").strip()
    if not username or not password:
        return response.Response({"error": "username and password required"}, status=400)
    if User.objects.filter(username=username).exists():
        return response.Response({"error": "username taken"}, status=400)
    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)  
    return response.Response({"user": UserSerializer(user).data}, status=201)

@ensure_csrf_cookie
@csrf_protect
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")
    user = authenticate(request, username=username, password=password)
    if not user:
        return response.Response({"error": "invalid credentials"}, status=400)
    login(request, user)
    return response.Response({"user": UserSerializer(user).data})

@api_view(["POST"])
def logout_view(request):
    logout(request)
    return response.Response({"ok": True})

@ensure_csrf_cookie
@api_view(["GET"])
def csrf(request):
    return response.Response({"ok": True})

@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token(request):
    return response.Response({"csrfToken": get_token(request)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_watchlist(request):
    movies = Movie.objects.filter(in_watchlists__user=request.user).prefetch_related("genres")
    ser = MovieSerializer(movies, many=True, context={"request": request})
    return response.Response(ser.data)

