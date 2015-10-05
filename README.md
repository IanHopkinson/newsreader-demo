# NewsReader Demo
 Ian Hopkinson 2015-10-02

 A web app which demos the [NewsReader Project](https://) technology by making visualisations via the [Simple API](), developed at [ScraperWiki](https://scraperwiki.com). 

# TODO

1. Network.html should really have an "actor selector" and we should have a default "actor" for the menu
2. Provide a "Getting data..." notification
4. Handle "No data" - get an internal server error when asking for data on someone who doesn't exist.
5. Network view should overlay a second network on double-clicking a node
6. Single click on node should give biographical information

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

Making the d3 SVG responsive:

http://stackoverflow.com/a/25978286/19172

Data Attributes look interesting:

https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes