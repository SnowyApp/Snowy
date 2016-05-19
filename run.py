"""
Starts the application
"""
from application import app
app.debug = False
app.run(host='0.0.0.0')
