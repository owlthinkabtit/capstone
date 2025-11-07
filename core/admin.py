from django.contrib import admin
from .models import Movie, Genre, Watchlist, Profile

# Register your models here.
admin.site.register(Movie)
admin.site.register(Genre)
admin.site.register(Watchlist)
admin.site.register(Profile)