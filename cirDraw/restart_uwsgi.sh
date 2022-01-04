#! /bin/bash
kill -9 $(pgrep uwsgi);
sudo uwsgi --ini /home/tianqinl/e2database-release/cirDraw/uwsgi.ini --uid tianqinl --enable-threads;

sudo systemctl reload nginx
