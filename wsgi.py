#!/usr/bin/env python
import os

virtenv = os.path.join(os.environ.get('OPENSHIFT_PYTHON_DIR', '.'), '/virtenv/')

from application import app as application


if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    httpd = make_server('localhost', 8051, application)
    httpd.serve_forever()

