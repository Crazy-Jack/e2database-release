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

    # check meta statistics
    url(r'^get_meta_stats/$', views.get_meta_stats, name='get_meta_stats'),

    # check meta statistics for each gene
    url(r'^get_meta_stats_each_gene/$', views.get_meta_stats_each_gene, name='get_meta_stats_each_gene'),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

