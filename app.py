from flask import Flask
from flask import request
from flask import render_template
import pandas as pd
import json

app = Flask(__name__)


@app.route('/')
def index():
    return "Welcome to ModelPatient 2.0"

@app.route('/<string:page_name>/')
def render_static(page_name):
        #return render_template('%s.html' % page_name)
        return render_template(page_name)
