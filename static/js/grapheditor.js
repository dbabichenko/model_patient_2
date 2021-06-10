/**********************
	http://bl.ocks.org/mccannf/1629464
**********************/

/* 
* D3 does not support a true double-click event.  In order to fake a double-click event, we need to grab the initial click time for any click event,
* store the time in milliseconds in the clickTime global variable, and for each subsequent click measure the time elapsed (delta) between the two clicks.
* If the delta < 300 milliseconds, consider it a double click
*/
var clickTime = new Date().getTime();

// Grab the SVG element
var svg = d3.select("#networkMap").append("svg").attr("width", 10000).attr("height", 5000);

var TEXT_WIDTH = 20;
var TEXT_LABEL_OFFSET = 15;
var BAR_NODE_STATE_HEIGHT = 20;
var BAR_NODE_WIDTH = 150;
var NODE_STATE_COLOR_LIST = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];





/*
* Render Bayesian Network Model graph for display.  Currently nodes have two display states - a node can be displayed as an oval 
* (viewMode = 0) or as a rectangle with all states and their respective probabilities visible (viewMode = 1)
*/
function renderMap(viewMode) {
    svg.selectAll("*").remove();

    // The following section of code defines arrowheads that show direction of each edge
    var defs = svg.append("svg:defs");
	var marker = defs.append("svg:marker").attr("id", "StartMarker")    
	.attr("viewBox", "0 -5 10 10")
	.attr("refX", 100)
	.attr("refY", 0)
	.attr("markerWidth", 5)
	.attr("markerHeight", 5)
	.attr("orient", "auto")
	.append("svg:path")
	.attr("d", "M0,-5L10,0L0,5");

    // The following section of code defines drag-and-drop behavior for nodes
	var drag = d3.behavior.drag()
        .on("dragstart", function () {
            var dot = d3.select(this);
            dot.classed("dragging", true);
            d3.select("body").classed("dragging", true);

            // hideEdges(dot.datum());
            
            //d3.timer(function (t) {

            //    return lerp(dot);

            //});
        })
        .on("drag", function () {
            var coordinates = d3.mouse(this);
            
            d3.select(this).attr("transform", function () {
                d3.select(this).datum().X = coordinates[0];
                d3.select(this).datum().Y = coordinates[1];
                return "translate(" + coordinates + ")";
            });
        })
        .on("dragend", function () {
            moveNodeAndEdges(d3.select(this).datum(), this, viewMode);
            // saveNodeData(d3.select(this).datum());
        });

	
    // Render edges before rendering nodes 
	for (var key in modelEdges) {
	    if (modelEdges.hasOwnProperty(key)) {
	        // Before rendering an edge, add two properties to it - one for parent node and one for child node.
	        modelEdges[key].ParentNode = findInModel(modelEdges[key].ParentID);
	        modelEdges[key].ChildNode = findInModel(modelEdges[key].ChildID);
	        renderEdge(modelEdges[key], viewMode);
	    }
	}

	
	
	
	
	   
    for (var i = 0; i < modelNodes.length; i++) {
        nodeData = modelNodes[i];
        // "group" is a parent element - background, label, etc... are attached to it
        var group = svg.append("g")
            .attr("id", nodeData.AutoID)
            .on("click", checkDoubleClick);
            // .call(drag);

        // Create background
        group.append("rect")
        .attr("id", "background_" + nodeData.AutoID)
        .attr("x", (nodeData.X - nodeData.Width))
        .attr("y", function () { return nodeData.Y - BAR_NODE_STATE_HEIGHT; })
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("width", BAR_NODE_WIDTH)
        .attr("height", function () {
            var nodeHeight = count(nodeData.States) * BAR_NODE_STATE_HEIGHT + BAR_NODE_STATE_HEIGHT + count(nodeData.States) * 10;
            return nodeHeight;
        })
        .style("stroke", function () { return nodeData.BorderColor; })
        .style("fill", function () { return nodeData.InteriorColor; });

        // Create label for node title
        group.append("text")
        .attr("id", "nodeLabel_" + nodeData.AutoID)
        .attr("x", function () { return (nodeData.X - nodeData.Width + TEXT_WIDTH - TEXT_LABEL_OFFSET); })
        .attr("y", function () { return nodeData.Y; })
        .text(function () { return nodeData.NodeLabel.substring(0, TEXT_WIDTH - 5) + "..."; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
       
        // Create label for temporal tier
        group.append("text")
        .attr("id", "nodeTemporalTier_" + nodeData.AutoID)
        .attr("x", function () { return nodeData.X + 50; })
        .attr("y", function () { return nodeData.Y; })
        .text(function () { return nodeData.TemporalTier; })
        .attr("font-family", "sans-serif")
        .attr("fill", "#ff0000")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

        // Create containers for node states
	    var j = 0;
	    for (var key in nodeData.States) {
	        group.append("rect")
            .attr("id", function() { return "STATE_CONTAINER|||" + nodeData.ID + "|||" + key})
            .attr("x", function () { return nodeData.X - nodeData.Width; })
            .attr("y", function () { return nodeData.Y + j * BAR_NODE_STATE_HEIGHT + 10; })
            .attr("width", function () { return (BAR_NODE_WIDTH * nodeData.States[key].StateProbability); })
            .attr("height", function () { return BAR_NODE_STATE_HEIGHT; })
            .style("stroke", function () { return nodeData.BorderColor; })
            .style("fill", NODE_STATE_COLOR_LIST[j])
            .on("click", function () {
                handleNodeStateUpdate(this.id);
            });

            // Create text labels for node states
	        var stateLabelData = { networkID: netID, nodeID: nodeData.ID, stateName: key, stateID: nodeData.States[key].StateAutoID };
	        group.append("text")
            .datum(stateLabelData)
            .attr("id", "textLabel_" + nodeData.States[key].StateAutoID)
            .attr("x", function () { return nodeData.X - nodeData.Width + 5; })
            .attr("y", function () { return nodeData.Y + j * BAR_NODE_STATE_HEIGHT + 25; })
            .text(function () { return nodeData.States[key].StateLabel + ": " + (nodeData.States[key].StateProbability * 100).toFixed(2) + "%"; })
            .attr("class", "nodeStateSelectorLabel")
            .on("click", function () {
                handleNodeStateUpdate(this.id);
            })
            .on("mouseover", function(){
                d3.select(this).style("cursor", "pointer");
            })
            .on("mouseup", function () {
                d3.select(this).style("cursor", "pointer");
            })
	        .on("mouseout", function(){
	            d3.select(this).style("cursor", "default")
	        });
	            
	        j++;
	    }
	        
	}
}	



/*
* Each time user clicks on a node's state, the entire model needs to be updated and refreshed.
* Even though the model is cached, this is causing some performance issues - need to be addressed in the future
*/
function handleNodeStateUpdate(objID) {
    var stateData = d3.select('#' + objID).datum();
    var nodeID = stateData.nodeID;
    var stateID = stateData.stateName;
    modelNetwork.SelectedNodeStates[nodeID] = stateID;
    // console.log(modelNetwork.SelectedNodeStates);
    listSelectedStates();
    // var url = "/Rest/ModelViewer?networkID=" + netID + "&nodeID=" + nodeID + "&stateID=" + stateID;
    $.post("/Rest/UpdateModelStates", { "networkID": netID, "selectedNodesStates": JSON.stringify(modelNetwork.SelectedNodeStates) }, function (data) {
        var url = "/Rest/ModelViewer?networkID=" + netID;
        // console.log(url);
        loadMapData(url);
    });
    
}

function resetModelStates() {
    $.post("/Rest/ResetModelStates", { "networkID": netID}, function (data) {
        var url = "/Rest/ModelViewer?networkID=" + netID;
        // console.log(url);
        loadMapData(url);
    });
}

function removeSelectedState(nodeID) {
    delete modelNetwork.SelectedNodeStates[nodeID];
    if (Object.keys(modelNetwork.SelectedNodeStates).length == 0) {
        resetModelStates();
    }
    else {
        listSelectedStates();
        $.post("/Rest/UpdateModelStates", { "networkID": netID, "selectedNodesStates": JSON.stringify(modelNetwork.SelectedNodeStates) }, function (data) {
            var url = "/Rest/ModelViewer?networkID=" + netID;
            loadMapData(url);
        });
    }
}

function listSelectedStates() {
    $tbl = $('#selectedBeliefs');
    $tbl.empty();
    for (var nodeID in modelNetwork.SelectedNodeStates) {
        var n = findInModel(nodeID);
        $tr = $('<tr></tr>');
        $td = $('<td></td>');
        $td.html(n.NodeLabel + ":");
        $tr.append($td);
        $td = $('<td></td>');
        var stateLabel = "";
        for (var stateID in n.States) {
            if (stateID == modelNetwork.SelectedNodeStates[nodeID]) {
                stateLabel = n.States[stateID].StateLabel;
                break;
            }
        }
        $td.html(stateLabel);
        $tr.append($td);
        
        $td = $('<td></td>');
        $td.html("<a class='actionTextButton' href=javascript:removeSelectedState('" + nodeID + "');><img src='/Images/Icons/delete-icon-tiny.png' border='0'></a>");
        $tr.append($td);
        $tbl.append($tr);
    }
}

/* 
* D3 does not support a true double-click event.  In order to fake a double-click event, we need to grab the initial click time for any click event,
* store the time in milliseconds in the clickTime global variable, and for each subsequent click measure the time elapsed (delta) between the two clicks.
* If the delta < 300 milliseconds, consider it a double click
*/
function checkDoubleClick() {
    
    var d2 = new Date().getTime();
    var delta = d2 - clickTime; // Difference in time between two clicks
    console.log(delta);
    if (delta < 300) { // If the delta < 300 milliseconds, consider it a double click
        loadNodeDetails($(this).attr("id")); // Display edit window for selected node
    }
    clickTime = d2; // Reset initial click time to the time of the second click
}


/*
* Node editor window
*/
function loadNodeDetails(nodeID) {
    var nodeObject = findInModel(nodeID);
    
    $tbl = $('#tblNodeEditor');
    $tbl.empty();
    // Create header row
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $td.attr("colspan", "3");
    $tr.append($td);
    $tbl.append($tr);
    var txt = $('<input type="text" class="bnEditorField" style="width: 300px" />');
    txt.blur(function () {
        updateNodeLabel(nodeID, $(this).val());
    });
    txt.val(nodeObject.NodeLabel);
    $td.append(txt);

    $td = $('<td></td>');
    $td.html("<b>Node Type:</b>")
    $tr.append($td);
    $td = $('<td></td>');
    $td.append(createNodeTypeSelect(nodeObject));
    $tr.append($td);
    
    // Create row for "Node Categories" dropdown
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $td.html("<b>Category:</b>");
    $tr.append($td);
    $td = $('<td></td>');
    $td.attr("colspan", "2");
    $td.append(createNodeCategoriesSelect(nodeObject));
    $tr.append($td);
    $tbl.append($tr);

    // Create row for "Temporal tiers" dropdown
    $td = $('<td></td>');
    $td.html("<b>Temporal Tier:</b>");
    $tr.append($td);
    $td = $('<td></td>');
    $td.attr("colspan", "2");
    $td.append(createNodeTemporalTiersSelect(nodeObject));
    $tr.append($td);
    $tbl.append($tr);

    // Create columns for "Units" textbox
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $td.html("<b>Units:</b>");
    $tr.append($td);
    $td = $('<td></td>');
    $td.attr("colspan", "2");
    var unitTxt = $('<input type="text" class="bnEditorField" />');
    unitTxt.val(nodeObject.Units);
    unitTxt.blur(function () {
        // nodeObject.Units = $(this).val();
        updateNodeUnits(nodeObject.AutoID, $(this).val());
    });
    $td.append(unitTxt);
    $tr.append($td);
    $tbl.append($tr);


    // Create columns for "Show states as choices" checkbox
    $td = $('<td></td>');
    $td.html("<b>Show States as Choices:</b>");
    $tr.append($td);
    $td = $('<td></td>');
    $td.attr("colspan", "2");
    $chk = $("<input />");
    $chk.attr({
        "id": "statesAsChoices_" + nodeObject.AutoID,
        "type": "checkbox"
    });
    if (nodeObject.ShowStatesAsChoices) {
        $chk.attr({"checked": "checked"});
    }
    $chk.click(function () {
        var showStatesAsChoices = $(this).is(':checked');
        updateNodeShowStatesAsChoices(nodeObject.AutoID, showStatesAsChoices);

    });
    $td.append($chk);
    $tr.append($td);
    $tbl.append($tr);





    // Create row for column headings
    $tr = $('<tr id="nodeStatesListHeader"></tr>');
    $tr.append('<td>State</td><td>Probability</td><td>Lower Range</td><td>Upper Range</td><td>Default Value</td>');
    $tbl.append($tr);

    // Create rows for individual states
    for (var key in nodeObject.States) {
        $tr = $('<tr></tr>');
        $td = $('<td></td>');
        var txt = $('<input type="text" class="bnEditorField" />');
        txt.val(nodeObject.States[key].StateLabel);
        txt.attr("id", "StateLabel_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID);
        $td.append(txt);
        $tr.append($td);
        
        $td = $('<td></td>');
        txt = $('<input type="text" class="bnEditorField" />');
        txt.val(nodeObject.States[key].StateProbability);
        txt.attr("id", "StateProbability_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID);
        $td.append(txt);
        $tr.append($td);

        $td = $('<td></td>');
        txt = $('<input type="text" class="bnEditorField" />');
        txt.val(nodeObject.States[key].LowerRange);
        txt.attr("id", "LowerRange_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID);
        $td.append(txt);
        $tr.append($td);

        $td = $('<td></td>');
        txt = $('<input type="text" class="bnEditorField" />');
        txt.val(nodeObject.States[key].UpperRange);
        txt.attr("id", "UpperRange_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID);
        $td.append(txt);
        $tr.append($td);

        $td = $('<td></td>');
        txt = $('<input type="text" class="bnEditorField" />');
        txt.val(nodeObject.States[key].DefaultValue);
        txt.attr("id", "DefaultValue_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID);
        /*
        txt.click(function () {
            generateRandomFromRange(nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID);
        });
        */
        $td.append(txt);
        $tr.append($td);

        $tbl.append($tr);

        $("#StateLabel_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID).blur(function () {
            updateNodeStateData($(this));
        });
        $("#StateProbability_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID).blur(function () {
            updateNodeStateData($(this));
        });
        $("#LowerRange_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID).blur(function () {
            updateNodeStateData($(this));
        });
        $("#UpperRange_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID).blur(function () {
            updateNodeStateData($(this));
        });
        $("#DefaultValue_" + nodeObject.AutoID + "_" + nodeObject.States[key].StateAutoID).blur(function () {
            updateNodeStateData($(this));
        });
    }
    
    // Show node editor modal popup
    $("#nodeDetailEditor").dialog({
        width: 'auto'
    });

}

function generateRandomFromRange(fieldIdSuffix) {
    $lowerRange = $("#LowerRange_" + fieldIdSuffix);
    $upperRange = $("#UpperRange" + fieldIdSuffix);
    $defaultVal = $("#DefaultValue_" + fieldIdSuffix);
    if ($lowerRange.val() != "" && $upperRange.val() != "") {
        var low = parseFloat($lowerRange.val());
        var high = parseFloat($upperRange.val());
        var rand = Math.floor(Math.random() * high) + low;
        $defaultVal.val(rand);
    }
}

function displayErrorMessage(errorCode) {
    var msg = "";
    switch (errorCode) {
        case 1:
            msg += "Unable to update database.";
            break;
        case 2:
            msg += "Unable to update statistical model.";
            break;
    }
    if (msg != "") { alert(msg) };
    
}


function updateNodeLabel(nodeID, nodeLabel) {
    targetUrl = "/Rest/UpdateNodeLabel";
    var updateData = {};
    updateData.networkID = netID;
    updateData.nodeID = nodeID;
    updateData.nodeLabel = nodeLabel;
    console.log(updateData);
    $.post(targetUrl, updateData, function (data) {
        // handle error code here... 
    });
    for (var i = 0; i < modelNodes.length; i++) {
        if (modelNodes[i].ID.toUpperCase() == nodeID.toUpperCase() || modelNodes[i].AutoID.toUpperCase() == nodeID.toUpperCase()) {
            
            modelNodes[i].NodeLabel = nodeLabel;
            break;
        }
    }
    updateD3textLabel('nodeLabel_' + nodeID, nodeLabel);
}

function updateNodeStateData(obj) {
    var stateLabel = "";
    if (obj) {
        var attrList = obj.attr("id").split("_");
        if (attrList.length == 3) {
            nodeID = attrList[1];
            stateID = attrList[2];
            targetUrl = "/Rest/UpdateNodeStateData";
            var updateData = {};
            updateData.networkID = netID;
            updateData.nodeID = nodeID;
            updateData.stateID = stateID;
            updateData.stateLabel = $('#StateLabel_' + nodeID + "_" + stateID).val();
            updateData.stateProbability = $('#StateProbability_' + nodeID + "_" + stateID).val();
            updateData.lowerRange = $('#LowerRange_' + nodeID + "_" + stateID).val();
            updateData.upperRange = $('#UpperRange_' + nodeID + "_" + stateID).val();
            updateData.defaultValue = $('#DefaultValue_' + nodeID + "_" + stateID).val();
            console.log(updateData);
            
            $.post(targetUrl, updateData, function (data) {
                // error handling later...
            });
        
            for (var i = 0; i < modelNodes.length; i++) {
                for (var key in modelNodes[i].States) {
                    if (modelNodes[i].States.hasOwnProperty(key)) {
                        if (modelNodes[i].States[key].StateAutoID.toUpperCase() == stateID.toUpperCase()) {
                            modelNodes[i].States[key].StateLabel = updateData.stateLabel;
                            modelNodes[i].States[key].StateProbability = updateData.stateProbability;
                            modelNodes[i].States[key].LowerRange = updateData.lowerRange;
                            modelNodes[i].States[key].UpperRange = updateData.upperRange;
                            modelNodes[i].States[key].DefaultValue = updateData.defaultValue;
                            // Concattenate label and probability together to update the state display value in D3 (svg)
                            stateLabel = updateData.stateLabel + ": " + (modelNodes[i].States[key].StateProbability * 100).toFixed(2) + "%";
                            break;
                        }
                    }
                }
            }
            updateD3textLabel('textLabel_' + stateID, stateLabel);
           
        }
    }
}

function updateD3textLabel(textLabelID, newText) {
    d3.select('#' + textLabelID)
        .transition()
        .duration(100)
        .style("opacity", 0)
        .transition().duration(100)
        .style("opacity", 1)
        .text(newText);
}

function updateD3nodeColor(objID, newColor) {
    d3.select('#' + objID)
        .transition()
        .duration(100)
        .style("opacity", 0)
        .transition().duration(100)
        .style("opacity", 1)
        .style("fill", newColor);
}

function updateD3nodeTemporalTier(objID, newTier) {
    d3.select('#' + objID)
        .transition()
        .duration(100)
        .style("opacity", 0)
        .transition().duration(100)
        .style("opacity", 1)
        .text(newTier);
}



function findInModel(nodeID) {
	for (var i = 0; i < modelNodes.length; i++) {
	    if (modelNodes[i].ID.toUpperCase() == nodeID.toUpperCase() || modelNodes[i].AutoID.toUpperCase() == nodeID.toUpperCase()) {
			return modelNodes[i];
		}
	}
	return null;
}



function findEdge(edges, find) {
	for (var i = 0; i < edges.length; i++) {
		if (edges[i].ID == find) {
			return edges[i];
		}
	}
	return null;
}

function findChildEdges(node) {
    var childEdges = [];
    if (node.Children) {
        for (var i = 0; i < node.Children.length; i++) {
            var edgeID = node.ID + "___" + node.Children[i];
            var e = modelEdges[edgeID];
            if (e) {
                childEdges.push(e);
            }
        }
    }
	return childEdges;
}

function findParentEdges(node) {
    var parentEdges = [];
    if (node.Parents) {
        for (var i = 0; i < node.Parents.length; i++) {
            var edgeID = node.Parents[i] + "___" + node.ID;
            var e = modelEdges[edgeID];
            if (e) {
                parentEdges.push(e);
            }
        }
    }
	return parentEdges;
}

function findDirectlyConnectedNodes(edges, nodeID) {
	var nodeList = [];
	for (var i = 0; i < edges.length; i++) {
		if (edges[i].sourceNode.ID == nodeID) {
			nodeList.push(edges[i].sourceNode);
		}
		if (edges[i].targetNode.ID == nodeID) {
			nodeList.push(edges[i].targetNode);
		}
	}
	return nodeList;
}

function renderEdge(edge, viewMode) {
    if (edge) {
        svg.append("path", "g")
		.attr("class", "link")
		.attr("id", edge.ID)
		.attr("d", function(d) {
			var sourceX, sourceY, targetX, targetY;
			if(viewMode == 0){
				sourceX = edge.ParentNode.X;
				sourceY = edge.ParentNode.Y;
				targetX = edge.ChildNode.X;
				targetY = edge.ChildNode.Y;
			}
			else{
			    sourceX = edge.ParentNode.X + (edge.ParentNode.Width / 2);
			    sourceY = edge.ParentNode.Y + (edge.ParentNode.Height / 2);
			    targetX = edge.ChildNode.X + (edge.ChildNode.Width / 2);
			    targetY = edge.ChildNode.Y + (edge.ChildNode.Height / 2);
			}

			var p = "M " + sourceX + " " + sourceY;
			p += " L " + targetX + " " + targetY;
			return p;
		})
		.style("marker-end", "url(#StartMarker)");
	}
}

function hideEdges(d) {
    var c = findChildEdges(d);
	var p = findParentEdges(d);
	for (var i = 0; i < c.length; i++) {
		d3.select("#" + c[i].ID).remove();
	}
	
	for (var i = 0; i < p.length; i++) {
		d3.select("#" + p[i].ID).remove();
	}
}
	
function moveNodeAndEdges(d, obj, viewMode) {
    console.log(obj);
    var c = findChildEdges(d);
    var p = findParentEdges(d);
    console.log(c);
    console.log(p);
    for (var i = 0; i < c.length; i++) {
		renderEdge(c[i], viewMode);
	}
	
	for (var i = 0; i < p.length; i++) {
		renderEdge(p[i], viewMode);
	}

    /* This part will need to be rewritten */
    /*
	obj.parentNode.appendChild(obj); 
	for (var i = 0; i < modelNodes.length; i++) {
	    var el = d3.select("#" + modelNodes[i].ID);
		if (el) {
			el[0][0].parentNode.appendChild(el[0][0]);
		}
	}
    */
}
	
function highlightEdges(edgeID, isOn) {
    var c = findChildEdges(edgeID);
    console.log(c);
	for (var i = 0; i < c.length; i++) {
		var obj = d3.select("#" + c[i].ID);
		if(obj){
			if(isOn){
				obj.style({"stroke":"red", "stroke-width":2});	
			}
			else{
				obj.style({"stroke":"#ccc", "stroke-width":2});	
			}
			
		}
	}
}


function updateNodeUnits(nodeID, unitsValue) {
    var updateData = {};
    updateData.nodeID = nodeID;
    updateData.units = unitsValue;
    console.log(updateData);
    for (var i = 0; i < modelNodes.length; i++) {
        if (modelNodes[i].ID.toUpperCase() == nodeID.toUpperCase() || modelNodes[i].AutoID.toUpperCase() == nodeID.toUpperCase()) {

            modelNodes[i].Units = unitsValue;
            console.log(modelNodes[i].Units);
            break;
        }
    }
    $.post("/Rest/UpdateNodeUnits", updateData, function (data) {
        console.log(data);
        // Error handling...
    });

}


function updateNodeShowStatesAsChoices(nodeID, showStatesAsChoices) {
    var updateData = {};
    updateData.nodeID = nodeID;
    updateData.showStatesAsChoices = showStatesAsChoices;
    console.log(updateData);
    for (var i = 0; i < modelNodes.length; i++) {
        if (modelNodes[i].ID.toUpperCase() == nodeID.toUpperCase() || modelNodes[i].AutoID.toUpperCase() == nodeID.toUpperCase()) {
            modelNodes[i].ShowStatesAsChoices = showStatesAsChoices;
            break;
        }
    }
    $.post("/Rest/UpdateNodeShowStatesAsChoices", updateData, function (data) {
        console.log(data);
        // Error handling...
    });

}



function count(obj) { return Object.keys(obj).length; }


function createNodeTemporalTiersSelect(node) {
    $evtTemporalTiers = $('<select>');
    for (var i = 1; i < 20; i++) {
        $opt = $('<option>');
        $opt.attr({
            "value": i
        });

        if (parseInt(i) == parseInt(node.TemporalTier)) {
            $opt.attr("selected", "selected");
        }
        $opt.text(i);

        $evtTemporalTiers.change(function () {
            var temporalTier = $(this).children("option").filter(":selected").val();
            var updateData = {
                "nodeID": node.AutoID,
                "temporalTier": temporalTier
            }

            $.post("/Rest/UpdateNodeTemporalTier", updateData, function (data) {
                for (var i = 0; i < modelNodes.length; i++) {
                    if (modelNodes[i].ID.toUpperCase() == node.AutoID.toUpperCase() || modelNodes[i].AutoID.toUpperCase() == node.AutoID.toUpperCase()) {
                        modelNodes[i].TemporalTier = temporalTier;
                        updateD3nodeTemporalTier("nodeTemporalTier_" + modelNodes[i].AutoID, temporalTier);
                        break;
                    }
                }
            });
        });

        $evtTemporalTiers.append($opt);
    }
    return $evtTemporalTiers;
}


function createNodeTypeSelect(node) {
    $nodeTypeSelect = $('<select>');
    for (var nodeType in nodeTypes) {
        $opt = $('<option>');
        $opt.attr({
            "value": nodeTypes[nodeType]
        });
        if (nodeTypes[nodeType] == node.NodeType) {
            $opt.attr("selected", "selected");
        }
        $opt.text(nodeType);
        $nodeTypeSelect.append($opt);
    }

    $nodeTypeSelect.change(function () {
        var selNodeType = $(this).children("option").filter(":selected").val();
        var updateData = {
            "nodeID": node.AutoID,
            "nodeType": selNodeType
        }


        $.post("/Rest/UpdateNodeType", updateData, function (data) {
            if (data) {
                var errorCode = -1; // Not initialized to a proper code value yet
                if ('responseCode' in data) {
                    errorCode = parseInt(data.responseCode);
                }
                if (errorCode == 0) {
                    for (var i = 0; i < modelNodes.length; i++) {
                        if (modelNodes[i].ID.toUpperCase() == node.AutoID.toUpperCase() || modelNodes[i].AutoID.toUpperCase() == node.AutoID.toUpperCase()) {
                            modelNodes[i].NodeType = selNodeType;
                            break;
                        }
                    }
                }
                else {
                    displayErrorMessage(errorCode);
                }
            }

        });
    });

    return $nodeTypeSelect;
}

function createNodeCategoriesSelect(node) {
    // console.log(node);
    $evtCategories = $('<select>');
    for (var i = 0; i < eventCategories.length; i++) {
        $opt = $('<option>');
        $opt.attr({
            "value": eventCategories[i].id
        });
        if (eventCategories[i].id == node.CategoryID) {
            $opt.attr("selected", "selected");
        }
        $opt.text(eventCategories[i].name);
        $evtCategories.append($opt);
    }
    $evtCategories.change(function () {
        var selCategoryID = $(this).children("option").filter(":selected").val();
        var updateData = {
            "nodeID": node.AutoID,
            "nodeCategory": selCategoryID
        }
        for (var i = 0; i < eventCategories.length; i++) {
            if (eventCategories[i].id == selCategoryID) {
                updateData.nodeColor = eventCategories[i].color;
            }
        }
        
        
        $.post("/Rest/UpdateNodeCategory", updateData, function (data) {
            if (data) {
                var errorCode = -1; // Not initialized to a proper code value yet
                if ('responseCode' in data) {
                    errorCode = parseInt(data.responseCode);
                }
                if (errorCode == 0) {
                    for (var i = 0; i < modelNodes.length; i++) {
                        if (modelNodes[i].ID.toUpperCase() == node.AutoID.toUpperCase() || modelNodes[i].AutoID.toUpperCase() == node.AutoID.toUpperCase()) {

                            modelNodes[i].CategoryID = selCategoryID;
                            modelNodes[i].InteriorColor = updateData.nodeColor;
                            console.log(updateData.nodeColor);

                            break;
                        }
                    }
                    updateD3nodeColor("background_" + updateData.nodeID, updateData.nodeColor);
                }
                else {
                    displayErrorMessage(errorCode);
                }  
            }

        });
    });
    return $evtCategories;
}

function lerp(dot) {

    var d = dot.datum();
    

    if (!dot.classed("dragging") && Math.abs(d.x2 - d.x) < 0.01 && Math.abs(d.y2 - d.y) < 0.01) {
        // It's not being dragged and it's roughly caught up
        return true;
    }

    // Constrain to bounds
    d.x = Math.max(Math.min(width, d.x + (d.x2 - d.x) * alpha), 0);
    d.y = Math.max(Math.min(height, d.y + (d.y2 - d.y) * alpha), 0);

    dot.attr("cx", d.x)
      .attr("cy", d.y);

    return false;

}
