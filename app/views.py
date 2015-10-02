#!/usr/bin/env python
# encoding: utf-8

from flask import render_template

from app import app

@app.route('/', methods=['GET', 'POST'])
def index():
    content = render_template("index.html")
    return content
