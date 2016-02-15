from application import app

app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


