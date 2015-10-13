var data;
var color = d3.scale.category20();
var width = 600, height = 400;

var force;

var svg; 

var link; 
var node;


function nodeClick(d) {
    $("#selected-actor").html('<strong>' + d.name + ':  </strong>')
    $("#selected-actor-biog").html(d["comment"])
    // Reset all colours
    d3.selectAll("circle").style('fill', function(d) { return color(d.group); })
    // Set one node colour
    d3.select(this).select("circle").style('fill', function(d) { return "red"; });
}

function nodeDblclick() {
    var actor = d3.select(this).select("title").text()
    var endpoint = $('#endpoint').text()
    console.log("Getting data for " + actor + " from " + endpoint)
    // Get data for new node
    d3.json("/network/" + endpoint + "/" + actor + "/data", function(error, new_graph) {
        if (error) throw error;
        new_data = new_graph;
        data.nodes.push(new_graph.nodes)
        data.links.push(new_graph.links)
    // Overlay new node data on old
        console.log("length of new data for : " + actor + " is " + new_data.nodes.length)
        force
            .nodes(data.nodes)
            .links(data.links)
            .start();

        link
            .data(data.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        node
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; })
            .on("click", nodeClick)
            .on("dblclick", nodeDblclick)
            .call(force.drag);

        node.append("circle")
            .attr("r", function(d) {
                return 3.0 + 2.0 * Math.sqrt(d.value);
            })
            .style("fill", function(d) {
                return color(d.group);
            })

        node.append("title")
            .text(function(d) {
                return d.name;
            });
    });

}

function pressRefresh(e){
  var endpoint = $('#endpoint').text()
  var actor = $('#selCentralActor').val()

  new_url = "/network/" + endpoint + "/" + actor
  window.location.href = new_url;
  
}

function tick() {
    link = link.attr("x1", function(d) {
            return d.source.x;
        })
        .attr("y1", function(d) {
            return d.source.y;
        })
        .attr("x2", function(d) {
            return d.target.x;
        })
        .attr("y2", function(d) {
            return d.target.y;
        });

    node = node.attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; })
}

$(document).ready(function() {
    // Start fetching data
    $("#refresh-btn").addClass("loading").html('Fetching…')

    svg = d3.select(".container")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        .classed("svg-content-responsive", true); 

    var endpoint = $('#endpoint').text()
    var actor = $('#actor').text()

    // This makes sure the actor appears in the select box
    $("#selCentralActor").val(actor)

    d3.json("/network/" + endpoint + "/" + actor + "/data", function(error, graph) {
        if (error) throw error;
        data = graph;
        
        force = 
            d3.layout.force()
            .charge(-120)
            .linkDistance(100)
            .size([width, height])
            .nodes(graph.nodes)
            .links(graph.links)
            .on("tick", tick)

        link = svg.selectAll(".link")
        link = link.data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        node = svg.selectAll(".node")
        node = node.data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            //.attr("transform", function(d) { return 'translate-setup(' + [d.x, d.y] + ')'; })
            .on("click", nodeClick)
            .on("dblclick", nodeDblclick)
            .call(force.drag);

        node = node
            .append("circle")
            .attr("r", function(d) {
                return 3.0 + 2.0 * Math.sqrt(d.value);
            })
            .style("fill", function(d) {
                return color(d.group);
            })

        node = node
            .append("title")
            .text(function(d) {
                return d.name;
            });

        svg = d3.select(".svg-content-responsive")
        node = svg.selectAll(".node")
        link = svg.selectAll(".link")

        force.start();
        // Put in the central actor name and biog
        $("#central-actor").html('<strong>' + actor + ':  </strong>')
        $("#central-actor-biog").html(graph["nodes"][0]["comment"])
        // Put the Refresh button back to normal
        $("#refresh-btn").removeClass("loading").html('<span class="glyphicon glyphicon-refresh"></span>Refresh')
    });
});
