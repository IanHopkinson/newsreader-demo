var color = d3.scale.category20();
var width = 600,
    height = 400;

var current_group = 1;

var graph = [];
var force = {};

var nodes = []
var links = []
force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height])
    .nodes(nodes)
    .links(links)
    .on("tick", tick)

var svg;

var link;
var node;


function nodeClick(n) {
    $("#selected-actor").html('<strong>' + n.name + ':  </strong>')
    $("#selected-actor-biog").html(n["comment"])
        // Reset all colours
    d3.selectAll("circle").style('fill', function(d) {
            return color(d.group);
        })
        // Set one node colour
    d3.select(this).select("circle").style('fill', function() {
        return "red";
    });
    force.start()
}

function combine_networks(old_graph, new_graph) {
    console.log("**graphs before combination**")
    console.log(old_graph)
    console.log(new_graph)
    var node_dict = new Array();
        for (var i = 0; i < old_graph.nodes.length; i++) {
            node_dict[old_graph.nodes[i].name] = i
        }
        console.log("**Initial node_dict**")
        console.log(node_dict)
        var origin_node_idx = node_dict[new_graph.nodes[0].name]
        for (var i = 0; i < new_graph.nodes.length; i++) {
            if (new_graph.nodes[i].name in node_dict) {
                // Node already exists
                console.log("Node already exists:" + new_graph.nodes[i].name)
                var id = node_dict[new_graph.nodes[i].name]
                old_graph.nodes[id].value = old_graph.nodes[id].value + new_graph.nodes[i].value
                // old_graph.nodes[id].group = current_group
                var new_link = {}
                new_link.source = id
                new_link.target = origin_node_idx
                new_link.value = 1
                old_graph.links.push(new_link)
            } else {
                // New node
                // Problem is that link 143, Rick Santorum has source undefined
                console.log("New node:" + new_graph.nodes[i].name)
                console.log(new_graph.nodes[i])
                new_graph.nodes[i].index = old_graph.nodes.length -1
                new_graph.nodes[i].group = current_group
                old_graph.nodes.push(new_graph.nodes[i])
                node_dict[new_graph.nodes[i].name] = old_graph.nodes.length - 1

                var new_link = {}
                new_link.source = old_graph.nodes.length - 1
                new_link.target = origin_node_idx
                new_link.value = 1
                old_graph.links.push(new_link)
            }
        }
        console.log("**graph after combination**")
        console.log(old_graph)
        console.log("**Final node_dict**")
        console.log(node_dict)
    return old_graph
}

function nodeDblclick() {
    var actor = d3.select(this).select("title").text()
    var endpoint = $('#endpoint').text()
    console.log("Getting data for " + actor + " from " + endpoint)
        // Get data for new node
    d3.json("/network/" + endpoint + "/" + actor + "/data", function(error, new_graph) {
        if (error) throw error;

        current_group = current_group + 1;
        var old_graph = {}
        old_graph.nodes = nodes
        old_graph.links = links
        console.log("length of old data : " + old_graph.nodes.length)
        console.log("length of new data : " + new_graph.nodes.length)
        
        old_graph = combine_networks(old_graph, new_graph)

        console.log("length of combined data : " + old_graph.nodes.length)

        links = old_graph.links
        nodes = old_graph.nodes

        //initialiseLayout(links, nodes);

        link = svg.select(".links").selectAll(".link")
        node = svg.select(".nodes").selectAll(".node")

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
        .linkDistance(30)
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .on("tick", tick)
}

//d.source.id + "-" + d.target.id
function populateNodes(links, nodes) {
    link = link.data(force.links())
    link.enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) {
            return Math.sqrt(d.value);
        });

    link.exit().remove()

    node = node.data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        //.attr("transform", function(d) { return 'translate-setup(' + [d.x, d.y] + ')'; })
        .on("click", nodeClick)
        .on("dblclick", nodeDblclick)
        .call(force.drag);

    node = node.data(force.nodes())
        .append("circle")
        .attr("r", function(d) {
            return 3.0 + 2.0 * Math.sqrt(d.value);
        })
        .style("fill", function(d) {
            return color(d.group);
        })

    node = node.data(force.nodes())
        .append("title")
        .text(function(d) {
            return d.name;
        });

    node.data(force.nodes()).exit().remove()
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

    svg.append("g").classed("links", true)
    svg.append("g").classed("nodes", true)

    // Get the data needed to make the data call 
    var endpoint = $('#endpoint').text()
    var actor = $('#actor').text()

    // This makes sure the actor appears in the select box
    $("#selCentralActor").val(actor)

    // Fetch the data and initialise the network
    d3.json("/network/" + endpoint + "/" + actor + "/data", function(error, graph) {
        if (error) throw error;
        // d3.json("/network/" + endpoint + "/Mitt_Romney/data", function(error, new_graph) {
        
        //graph = combine_networks(graph, new_graph)
        links = graph.links
        nodes = graph.nodes

        initialiseLayout(links, nodes);

        link = svg.select(".links").selectAll(".link")
        node = svg.select(".nodes").selectAll(".node")

        populateNodes(links, nodes)


        // Make sure the globals are initialised with the correct things
        svg = d3.select(".svg-content-responsive")
        node = svg.selectAll(".node")
        link = svg.selectAll(".link")
        // });

        // Put in the central actor name and biog
        $("#central-actor").html('<strong>' + actor + ':  </strong>')
        $("#central-actor-biog").html(graph["nodes"][0]["comment"])
            // Put the Refresh button back to normal
        $("#refresh-btn").removeClass("loading").html('<span class="glyphicon glyphicon-refresh"></span>Refresh')
    });
});
