# NewsReader Demo
 Ian Hopkinson 2015-10-02

 A web app which demos the [NewsReader Project](http://www.newsreader-project.eu/) technology by making visualisations via the [Simple API](https://newsreader.scraperwiki.com/), developed at [ScraperWiki](https://scraperwiki.com). 

## Local install

* `git clone git@github.com:scraperwiki/newsreader-demo`

You need to define an `NEWSREADER_PUBLIC_API_KEY` environment variable for local development, to access the
Simple API to a KnowledgeStore. This can be obtained by contacting hello@scraperwiki.com

### Running via Flask

* Work on a virtualenv (optional)
1. `pip install -r requirements.txt`
2. `python local_run.py`

App accessible via http://127.0.0.1:5000

### Running via Docker

1. Do `make run`

App accessible via http://0.0.0.0:8000

# TODO

0. Style central actors
2. List central actors as they are added
3. Add button to get events with selected actor

4. Handle "No data" - get an internal server error when asking for data on someone who doesn't exist.
8. Events involving both actors 
7. Force layout seems to start some way off screen... this looks like a fix: http://stackoverflow.com/a/19176409/19172

# Workflow Overview

* Find the most common types of actor
* Find out the most common people (dbo:People), places (dbo:Place), organisations (dbo:Organisation), companies (dbo:Company) ... in a corpus
* Find out which events involve a named actor selected from above
* Find out which other actors are involved in the events
* Show the documents supporting an Event
* Show a timeline of events

Document centric

* What documents published on a particular day?


# Notes

A query like this will give us the articles relating to an event in the form of mentions:

https://newsreader.scraperwiki.com/wikinews/property_of_an_actor?uris.0=http://en.wikinews.org/wiki/Vettel_becomes_youngest_Formula_One_champion%23ev27_1&uris.1=gaf:denotedBy

Mentions include a URL and a character offset. Alternatively we can use "describe" on an event and get everything. For a document a query like this:

https://newsreader.scraperwiki.com/wikinews/get_document_metadata?uris.0=http://en.wikinews.org/wiki/Vettel_becomes_youngest_Formula_One_champion

Should give us source, title and publication date (as well as a list of mentions)


Updating a force layout, Mike Bostock's illustration:

http://bl.ocks.org/mbostock/1095795

The data-join concept seems important:

http://bost.ocks.org/mike/join/

Really simple query to get a particular property about a particular uri

SELECT (<http://dbpedia.org/resource/Barack_Obama> AS ?actor) ?value
WHERE {
  OPTIONAL { <http://dbpedia.org/resource/Barack_Obama> rdfs:comment ?value }
}

Replace rdfs:comment with, for example, dbo:birthDate, dbo:birthPlace,

This one gets you everything:

SELECT (<http://dbpedia.org/resource/Barack_Obama> AS ?actor) ?item ?value
WHERE {
  OPTIONAL { <http://dbpedia.org/resource/Barack_Obama> ?item ?value }
}

The actor graph visualisation started life with this:

http://bl.ocks.org/mbostock/4062045

Adding drag + zoom:

http://bl.ocks.org/mbostock/6123708

Adding text to nodes:

http://stackoverflow.com/questions/20662192/how-to-place-text-on-the-circle-when-using-d3-js-force-layout

Making the d3 SVG responsive:

http://stackoverflow.com/a/25978286/19172

Data Attributes look interesting:

https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes