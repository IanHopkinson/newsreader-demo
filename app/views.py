#!/usr/bin/env python
# encoding: utf-8

from flask import render_template

from app import app

import json

data = []

@app.route('/')
def index():
    content = render_template("index.html")
    return content

@app.route('/data')
def getData():
    global data
    return json.dumps(data)

def read_data_file(filename):
    with open(filename) as data_file:    
        data = json.load(data_file)
    return data
    
data = read_data_file("app/static/miserables.json") 
