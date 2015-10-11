# NewsReader Demo
 Ian Hopkinson 2015-10-02

 A web app which demos the [NewsReader Project](https://) technology by making visualisations via the [Simple API](), developed at [ScraperWiki](https://scraperwiki.com). 

# TODO

4. Handle "No data" - get an internal server error when asking for data on someone who doesn't exist.
5. Network view should overlay a second network on double-clicking a node
6. Biography of central actor
7. Biography of selected actor
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