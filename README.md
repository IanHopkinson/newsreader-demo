# NewsReader Demo
 Ian Hopkinson 2015-10-02

 A web app which demos the [NewsReader Project](https://) technology by making visualisations via the [Simple API](), developed at [ScraperWiki](https://scraperwiki.com). 

# Workflow Overview

* Find the most common types of actor
* Find out the most common people (dbo:People), places (dbo:Place), organisations (dbo:Organisation), companies (dbo:Company) ... in a corpus
* Find out which events involve a named actor selected from above
* Find out which other actors are involved in the events
* Show the documents supporting an Event

Document centric

* What documents published on a particular day?


# Notes
 The actor graph visualisation started life with this:

 http://bl.ocks.org/mbostock/4062045

 Adding drag + zoom:

 http://bl.ocks.org/mbostock/6123708

 Adding text to nodes:

 http://stackoverflow.com/questions/20662192/how-to-place-text-on-the-circle-when-using-d3-js-force-layout
