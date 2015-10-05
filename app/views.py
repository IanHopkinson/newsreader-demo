#!/usr/bin/env python
# encoding: utf-8

from flask import render_template

from app import app

import json
import os
import requests

data = []

@app.route('/')
def index():
    content = render_template("index.html")
    return content

@app.route('/network',defaults={'endpoint': 'wikinews', 'actor':'Barack_Obama'})
@app.route('/network/<endpoint>/',defaults={'actor':'Barack_Obama'})
@app.route('/network/<endpoint>/<actor>')
def network(endpoint, actor):
    content = render_template("network.html", actor=actor)
    return content

@app.route('/network/<endpoint>/<actor>/data')
def getData(endpoint, actor):
    data = call_newsreader_events_shared(actor)
    return json.dumps(data)

def call_newsreader_events_shared(name):
    api_key = os.environ['NEWSREADER_PUBLIC_API_KEY']
    data = {"nodes": [], "links": []}
    names = [name]
    data["nodes"].append({"name":names[0],"group":1})
    data["links"].append({"source":0,"target":0,"value":1},)
    query_string_template = "https://newsreader.scraperwiki.com/wikinews/people_sharing_event_with_a_person/page/{page}?uris.0=dbpedia%3A{name}&output=json&api_key={api_key}"
    index = 1
    for name in names:
        page = 1
        while True:
            r = requests.get(query_string_template.format(name=name, page=page, api_key=api_key))
            page = page + 1
            if "error" in r.json().keys():
                break

            actor_data = r.json()
            for entry in actor_data["payload"]:
                count = actor_data["count"]
                actor = entry["actor2"].replace("http://dbpedia.org/resource/", "")
                data["nodes"].append({"name": actor,"group":1, "value":float(entry["numEvent"])})
                data["links"].append({"source":index,"target":0,"value":1},)
                index = index + 1
    data["nodes"][0]["value"] = count
    return data

 
