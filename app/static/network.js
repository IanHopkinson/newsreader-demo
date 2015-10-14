var color = d3.scale.category20();
var width = 600,
    height = 400;

var graph = [];
var force = {};

var nodes = []
var links = []
force = d3.layout.force()
    .charge(-120)
    .linkDistance(100)
    .size([width, height])
    .nodes(nodes)
    .links(links)
    .on("tick", tick)

var svg;

var link;
var node;


function nodeClick(d) {
    $("#selected-actor").html('<strong>' + d.name + ':  </strong>')
    $("#selected-actor-biog").html(d["comment"])
        // Reset all colours
    d3.selectAll("circle").style('fill', function(d) {
            return color(d.group);
        })
        // Set one node colour
    d3.select(this).select("circle").style('fill', function(d) {
        return "red";
    });
}

function nodeDblclick() {
    var actor = d3.select(this).select("title").text()
    var endpoint = $('#endpoint').text()
    console.log("Getting data for " + actor + " from " + endpoint)
        // Get data for new node
    d3.json("/network/" + endpoint + "/" + actor + "/data", function(error, new_graph) {
        if (error) throw error;

        console.log("length of old data : " + nodes.length)

        // We need to be smarter here,
        // (3) if yes then don't append but update value
        // (5) Add appropriate link to links.
        var node_dict = new Array();
        for (var i = 0; i < nodes.length; i++) {
            node_dict[nodes[i].name] = nodes[i].index
        }

        var origin_node_idx = node_dict[new_graph.nodes[0].name]
        for (var i = 0; i < new_graph.nodes.length; i++) {
            if (new_graph.nodes[i].name in node_dict) {
                // Node already exists
                var id = node_dict[new_graph.nodes[i].name]
                nodes[id].value = nodes[id].value + new_graph.nodes[i].value
                var new_link = {}
                new_link.source = id
                new_link.target = origin_node_idx
                new_link.value = 1
                links.push(new_link)
            } else {
                // New node
                nodes.push(new_graph.nodes[i])
                node_dict[new_graph.nodes[i].name] = nodes.length
                var new_link = {}
                new_link.source = nodes.length 
                new_link.target = origin_node_idx
                new_link.value = 1
                links.push(new_link)
            }
        }
        nodes = nodes.concat(new_graph.nodes)
        links = links.concat(new_graph.links)
            // Overlay new node data on old
        console.log("length of new data for : " + actor + " is " + new_graph.nodes.length)
        console.log("length of combined data : " + actor + " is " + nodes.length)

        initialiseLayout(links, nodes);

        link = svg.selectAll(".link")
        node = svg.selectAll(".node")

        populateNodes(links, nodes);
    });

}

function pressRefresh(e) {
    var endpoint = $('#endpoint').text()
    var actor = $('#selCentralActor').val()

    new_url = "/network/" + endpoint + "/" + actor
    window.location.href = new_url;

}

function tick() {
    svg = d3.select(".svg-content-responsive")
    node = svg.selectAll(".node")
    link = svg.selectAll(".link")

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

    node = node.attr("transform", function(d) {
        return 'translate(' + [d.x, d.y] + ')';
    })
}

function initialiseLayout(links, nodes) {
    force = d3.layout.force()
        .charge(-120)
        .linkDistance(100)
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .on("tick", tick)
}
//d.source.id + "-" + d.target.id
function populateNodes(links, nodes) {
    console.log(force)
    link = link.data(force.links())
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) {
            return Math.sqrt(d.value);
        });


    node = node.data(force.nodes())
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

    // Start it all running
    force.start();
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

    // Get the data needed to make the data call 
    var endpoint = $('#endpoint').text()
    var actor = $('#actor').text()

    // This makes sure the actor appears in the select box
    $("#selCentralActor").val(actor)

    // Fetch the data and initialise the network
    d3.json("/network/" + endpoint + "/" + actor + "/data", function(error, graph) {
        if (error) throw error;

        links = graph.links
        nodes = graph.nodes

        initialiseLayout(links, nodes);


        link = svg.selectAll(".link")
        node = svg.selectAll(".node")

        populateNodes(links, nodes)


        // Make sure the globals are initialised with the correct things
        svg = d3.select(".svg-content-responsive")
        node = svg.selectAll(".node")
        link = svg.selectAll(".link")


        // Put in the central actor name and biog
        $("#central-actor").html('<strong>' + actor + ':  </strong>')
        $("#central-actor-biog").html(graph["nodes"][0]["comment"])
            // Put the Refresh button back to normal
        $("#refresh-btn").removeClass("loading").html('<span class="glyphicon glyphicon-refresh"></span>Refresh')
    });
});
