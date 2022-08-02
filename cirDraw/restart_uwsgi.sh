#! /bin/bash
sudo kill -9 $(pgrep uwsgi);
sudo uwsgi --ini uwsgi.ini --wsgi-file /home/leelabupmcserver/e2database-release/cirDraw/cirDraw/wsgi.py 
sudo systemctl reload nginx
