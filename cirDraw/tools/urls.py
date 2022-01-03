from django.conf.urls import url
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [

    # Render pages
    url(r'^$', views.render_search_page, name='tools'),
    url(r'^stats/$', views.render_stats_page, name='tools_stats'),

    # Upload
    url(r'^search/$', views.search_indb, name='search_indb'),

    # check statistics
    url(r'^get_stats/$', views.get_stats, name='get_stats'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

