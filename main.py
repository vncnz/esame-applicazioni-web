from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='client')

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route("/api/<name>")
def hello_world(name):
    return f'<p>Hello, {name}!</p>'

if __name__ == '__main__':
    app.run()