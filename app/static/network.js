var data;

function nodeClick(d) {
    console.log(d["comment"])
    $("#selected-actor").html('<strong>' + d.name + ':  </strong>')
    $("#selected-actor-biog").html(d["comment"])
}

function nodeDblclick() {
    console.log("dblclick" + d3.select(this).title)
}

function pressRefresh(e){
  var endpoint = $('#endpoint').text()
  var actor = $('#selCentralActor').val()

  new_url = "/network/" + endpoint + "/" + actor
  window.location.href = new_url;
  
}

$(document).ready(function() {
    // Start fetching data
    $("#refresh-btn").addClass("loading").html('Fetching…')

    var width = 600,
        height = 400;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(100)
        .size([width, height]);

    /* var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);
    */

    var svg = d3.select(".container")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        .classed("svg-content-responsive", true); 

    /* function zoomed() {
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    } 
    */

    var endpoint = $('#endpoint').text()
    var actor = $('#actor').text()

    // This makes sure the actor appears in the select box
    $("#selCentralActor").val(actor)

    d3.json("/network/" + endpoint + "/" + actor + "/data", function(error, graph) {
        if (error) throw error;
        data = graph;
        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
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

/*        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name });
*/

        force.on("tick", function() {
            link.attr("x1", function(d) {
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

            node.attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; })

        // Put the Refresh button back to normal
        $("#refresh-btn").removeClass("loading").html('<span class="glyphicon glyphicon-refresh"></span>Refresh')
        });
    });
});
