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

@app.route('/events',defaults={'endpoint': 'wikinews', 'actor':'Barack_Obama'})
@app.route('/events/<endpoint>/',defaults={'actor':'Barack_Obama'})
@app.route('/events/<endpoint>/<actor>')
def events(endpoint, actor):
    content = render_template("events.html", actor=actor)
    return content

@app.route('/network/<endpoint>/<actor>/data')
def getnetworkData(endpoint, actor):
    data = get_newsreader_actor_network(actor)
    return json.dumps(data)

@app.route('/events/<endpoint>/<actor>/data')
def geteventsData(endpoint, actor):
    data = get_newsreader_events_timeline(actor)
    return json.dumps(data)

def get_newsreader_events_timeline(name):
    api_key = os.environ['NEWSREADER_PUBLIC_API_KEY']
    names = [name]
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
            # Set the comment for the root node
            data["nodes"][0]["value"] = actor_data["count"]
            for entry in actor_data["payload"]:
                count = actor_data["count"]
                actor = entry["actor2"].replace("http://dbpedia.org/resource/", "")
                data["nodes"].append({"name": actor,"group":1, "value":float(entry["numEvent"]), "comment": entry["comment"]})
                data["links"].append({"source":index,"target":0,"value":1},)
                index = index + 1
    data["nodes"][0]["value"] = count
    return data

def get_newsreader_actor_network(name):
    api_key = os.environ['NEWSREADER_PUBLIC_API_KEY']
    data = {"nodes": [], "links": []}
    names = [name]

    # Get biography of central actor
    property_string_template = "https://newsreader.scraperwiki.com/wikinews/property_of_an_actor?uris.0=dbpedia%3A{name}&uris.1={property}&output=json&api_key={api_key}"
    r = requests.get(property_string_template.format(name=name, property="rdfs:comment", api_key=api_key))
    response = r.json()
    comment = response["payload"][0]["value"]

    # Make node/link for central actor
    data["nodes"].append({"name":names[0],"group":1, "value":float(0.0), "comment": comment})
    data["links"].append({"source":0,"target":0,"value":1},)

    # Loop over data for actor network
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
            # Set the comment for the root node
            data["nodes"][0]["value"] = actor_data["count"]
            for entry in actor_data["payload"]:
                count = actor_data["count"]
                actor = entry["actor2"].replace("http://dbpedia.org/resource/", "")
                data["nodes"].append({"name": actor,"group":1, "value":float(entry["numEvent"]), "comment": entry["comment"]})
                data["links"].append({"source":index,"target":0,"value":1},)
                index = index + 1
    data["nodes"][0]["value"] = count
    return data


