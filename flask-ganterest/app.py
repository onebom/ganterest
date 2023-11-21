from flask import Flask, render_template, session, redirect, request, url_for
from flask_migrate import Migrate
from functools import wraps

from models import db, User, Pin

# Blueprints
from api.api import api ##??

app = Flask(__name__)
# load config from the config file we created earlier 
app.config.from_object('config') ##??
app.register_blueprint(api) ##??

db.init_app(app)
migrate = Migrate(app, db)
db.create_all(app=app)

#========================================================

@app.route('/')
def index():
    images = list(reversed(Pin.query.all()))
    return render_template('index.html', images=images)

@app.route('/search', methods=['POST'])
def search():
    from helpers import search_tag
    keyword = request.form['search']
    images = search_tag(keyword)
    return render_template('index.html', images=images)

##AUTHENTICATION##
# Login Decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' in session:
            return f(*args, **kwargs)
        return redirect(url_for('index'))
    return decorated_function


##CRUD PINS##
@app.route('/pins/new')
@login_required
def new():
    return render_template('newpin.html')

@app.route('/pins/<int:pin_id>', methods=['GET'])
def get_image(pin_id):
    this_pin = Pin.query.get(pin_id)
    pin_detail = this_pin.pin_detail.first()
    return render_template('show.html', this_pin=this_pin, pin_detail=pin_detail)

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)