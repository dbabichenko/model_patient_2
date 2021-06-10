var caseID = ""; // Unique identifier for the current VP case
var networkID = ""; // Unique identifier for the BN model associated with VP case
var caseData = null; // Object that will hold core VP case data
var modelData = null; // Object that will hold BN model nodes and edges
var caseContentData = null; // Object that will hold case content data
var currentCategory = 9; // Current category - the category that's currently being displayed in the EMR (ex: Demographic or Diagnoses)
var caseMetrics = null; // VP case metrics
var caseRules = null; // VP case rules
var timerCounter = 0;
var timerID = 1;
var outcomeNodeStateChangeLog = {};
var timeElapsed = 0;
var ruleTimeElapsedIndexes = [];
var decisionCount = 0;
var selectorTemporalTier = 1;

$(document).ready(function () {
    caseID = getUrlParameterByName("caseID");
    networkID = getUrlParameterByName("networkID");

    if (caseID != "") {
        // Get VP case data
        $.getJSON("/Rest/VpCase?caseID=" + caseID, function (cdata) { 
            if (cdata) {
                caseData = cdata;
                // Get BN model data
                $.getJSON("/Rest/ModelViewer?networkID=" + caseData.ModelID, function (mdata) {
                    if (mdata) {
                        modelData = mdata;
                        // Get case content data
                        $.getJSON("/Rest/GetCaseContentItems?caseID=" + caseID, function (contdata) {
                            caseContentData = JSON.parse(contdata);
                            // console.log(caseContentData); /* DEBUG */
                            
                            // Load data from custom VP case content
                            loadContentDataItems(caseContentData);
                        });
                        
                    }

                    // Configure modal popups
                    $('#learnerChoiceSelectorContainer').dialog({ autoOpen: false, width: 600 });
                    $('#feedbackContainer').dialog({ autoOpen: false, width: 600 });
                    
                    // By default, display "Demographic" data in the EMR view
                    loadPlayerCategory(9);
                });
                
            }
        });

        // Load metrics
        $.getJSON("/Rest/GetMetrics?caseID=" + caseID, function (metricList) {
            caseMetrics = JSON.parse(metricList);
            for (var i = 0; i < caseMetrics.length; i++) {
                caseMetrics[i].CurrentValue = caseMetrics[i].InitValue;
                // console.log(caseMetrics[i]); /* DEBUG */
                $metricContainer = $("<div></div>");
                $metricContainer.append($("<div>" +caseMetrics[i].MetricName + "</div>"))
                $("#playerMetricsDisplay").append($metricContainer);

                $progressBar = $("<div></div>");
                $progressBar.attr({
                    "id": "metric_" + caseMetrics[i].MetricID
                });
                
                $progressBar.progressbar({
                    value: parseInt(caseMetrics[i].InitValue),
                    max: parseInt(caseMetrics[i].UpperRange)
                });
                // $progressBar.css({'background-color': '#ffffff'});
                $progressBar.children().css({'background-color': '#bfbcbc'});
                $("#playerMetricsDisplay").append($progressBar);
            }
        });

        // Load rules
        $.getJSON("/Rest/GetRules?caseID=" + caseID, function (rulesList) {
            caseRules = JSON.parse(rulesList);
            // console.log(caseRules); /*DEBUG*/
            for (var r = 0; r < caseRules.length; r++) {
                if (caseRules[r].triggerType == 4) {
                    ruleTimeElapsedIndexes.push(parseInt(caseRules[r].triggerValueNumeric));
                }
            }
            // console.log(ruleTimeElapsedIndexes); /* DEBUG */
        });
    }

    setInterval(checkTimeElapsedRules, 1000);
});


/**************************************************************************************************************************************
Function:       loadContentDataItems
Description:    Render data from a case content. 
Argument(s):    ccd -   caseContentData - data from "casecontent" MongoDB collection. Iterates through caseContentData list 
                        and loads the data row-by-row
Return:         n/a
**************************************************************************************************************************************/
function loadContentDataItems(ccd) {
    // console.log(ccd); /**** DEBUG ****/
    for (var i = 0; i < ccd.length; i++) {
        var tbl = $('#tblCategory' + ccd[i].CategoryID);
        var div = $('#divCategory' + ccd[i].CategoryID);
        var cols = null;
        if (div && tbl) {
            cols = categoryColumns["category" + ccd[i].CategoryID];
            if (cols) {
                if (ccd[i].IsPriorHistory == "Yes") {
                    // console.log(ccd[i]) /* DEBUG */
                    var today = new Date();
                    var eventDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                    ccd[i][categoryDateFields["category" + ccd[i].CategoryID]] = eventDate;
                    loadContentItemRow(ccd[i], tbl, div, cols, false);
                }
                cols = null;
            }
        }
    }
}

/**************************************************************************************************************************************
Function:       loadContentItemRow
Description:    Loads/renders a single row of case content data from caseContentData and appends them to target table
Argument(s):    contentItem -   a single content object from  caseContentData
                tbl         -   HTML <table> jQuery object - this is the target table for the data
                div         -   HTML <div> jQuery object - this is the target div for the data
                cols        -   list of table columns - categoryColumns variables in globals.js
                isAddedByLearner - optional argument, specifies whether the row has been added by learner
Return:         n/a
**************************************************************************************************************************************/
function loadContentItemRow(contentItem, tbl, div, cols, isAddedByLearner) {
    
    var tr = $('<tr></tr>');
    tr.attr("id", "tr_" + contentItem.ContentItemID);
    var td = null;
    td = $('<td></td>');
    var marker = $("<div></div>");
    if (decisionCount >= colorList.length) {
        decisionCount = 0;
    }
    marker.css({
        'width' : '10px',
        'height': '10px',
        'border-radius': '5px',
        'border' : '1px #000000 solid',
        'background-color':colorList[decisionCount]
    });
    td.append(marker);
    tr.append(td);
    for (var i = 0; i < cols.length; i++) {
        if (cols[i] != "IsPriorHistory" && cols[i] != "DefaultBnState" && cols[i] != "Group" && cols[i] != "TemporalTier") { // Do not display prior history flag in player
            td = $('<td></td>');
            var cellContent = "";
            if (contentItem[cols[i]] != null) {
                cellContent = contentItem[cols[i]];
            }
            
            try {
                cellContent = decodeURI(cellContent);
            }
            catch(err) {
                // do nothing 
            }
            td.html(cellContent);
            tr.append(td);
        }
    }

    // Cell for "Cancel" button
    td = $('<td></td>');
    if(isAddedByLearner){
        td.html("<a href=javascript:cancelPlayerCategoryItem('" + contentItem.ContentItemID + "');>[cancel]</a>");
    }
    else {
        td.html("&nbsp;");
    }
    tr.append(td);

    // Cell for "Learner-added flag"
    td = $('<td></td>');
    if (isAddedByLearner) {
        td.html("Babichenko, Dmitriy");
    }
    else {
        td.html(caseData.Attending);
    }
    tr.append(td);

    tbl.append(tr);
}



/**************************************************************************************************************************************
Function:       loadPlayerCategory
Description:    Each EMR data category is defined in eventCategories object in globals.js  This function
                displayes EMR data based on the selected category.  No category is selected (page loaded for the first time),
                this function will display data for "Demographics" - category 9
Argument(s):    categoryID
Return:         N/A
**************************************************************************************************************************************/
function loadPlayerCategory(catID) {
    // By default, all category data tables (HTML tables) are not visible
    $('.playerInfoEditCategory').css({
        "display": "none",
        "visibility": "hidden"
    });

    // Find current category - linear search against eventCategories object in globals.js
    for (var i = 0; i < eventCategories.length; i++) {
        if (eventCategories[i].id == catID) {
            currentCategory = eventCategories[i]; // Found matching category
            break;
        }
    }

    if (currentCategory) {
        
        $('#categoryTitle').html(currentCategory.name); // Display category title at the top of the EMR page
        // There is a button for adding new content item to each category - rename that button according to the currently
        // selected category (ex: Add diagnosis) 
        $('#btnAddItem').val("Add " + currentCategory.name); 
        // Do not display add button for: encounters, demographic, social
        if((currentCategory.id == 9) || (currentCategory.id == 5) || (currentCategory.id == 7) ||(currentCategory.id == 0) || (currentCategory.id == 11)) {
            $('#btnAddItem').css({"display": "none", "visibility": "hidden"});
        }
        else {
            $('#btnAddItem').css({"display": "block", "visibility": "visible"});
        }

        // Make HTML table for the currently selected category visible
        $('#divCategory' + currentCategory.id).css({
            "display": "block",
            "visibility": "visible"
        });

        var notificationIcon = $("#playerCategory" + currentCategory.id).find("div");
        try{
            notificationIcon.remove();
        }
        catch (err) {
            // do nothing
        }

    }
    window.scrollTo(0, 0);
    cancelSelectedLearnerChoice();
    logEvent(currentCategory);

}

/**************************************************************************************************************************************
Function:       addCategoryItem
Description:    Whenever new case content item is being edited, we need to make sure that previous values have been cleared.  The only 
                purpose of this function is to reset edit forms in the modal popup used for editing and creating case content items.
Argument(s):    N/A
Return:         N/A
**************************************************************************************************************************************/
function addCategoryItem() {
    decisionCount++;
    $ddl = $("#ddlLearnerChoiceSelector");
    $ddl.empty();
    if(currentCategory != null) {
        $opt = $("<option></option>");
        $opt.attr("value", "");
        $ddl.append($opt);

        // Select nodes from the list of distractors (items from case content);

        for(var i = 0; i < caseContentData.length; i++) {
            if(parseInt(caseContentData[i].CategoryID) == parseInt(currentCategory.id)) {
                if(caseContentData[i].IsPriorHistory == "No") {
                    // console.log(caseContentData[i]); /* DEBUG */
                    var hasNodeType = caseContentData[i].hasOwnProperty("NodeType");
                    
                    var showContentItem = false;
                    if (hasNodeType) {
                        if (parseInt(caseContentData[i].NodeType) == 1) {
                            showContentItem = true;
                            // console.log(caseContentData[i]); /* DEBUG */
                        }
                    }
                    else {
                        showContentItem = true;
                    }

                    if (caseContentData[i].hasOwnProperty("TemporalTier")) {
                        if (caseContentData[i].TemporalTier != "") {
                            if (parseInt(caseContentData[i].TemporalTier) > selectorTemporalTier) {
                                showContentItem = false;
                            }
                        }
                    }
                    
                    if (showContentItem) {

                        
                        
                        switch (parseInt(currentCategory.id)) {
                            
                                case 1: // Diagnosis
                                    $ddl.append(formatLearnerChoiceItem(2, caseContentData[i].CategoryName, caseContentData[i].ContentItemID, caseContentData[i].Label));
                                    break;
                                case 2: // Procedure
                                    $ddl.append(formatLearnerChoiceItem(2, caseContentData[i].ProcedureName, caseContentData[i].ContentItemID, caseContentData[i].ProcedureName));
                                    break;
                                case 3: // Labs
                                    var temp = caseContentData[i].LabName;  + ", " +caseContentData[i].Result + " " +caseContentData[i].Units + " (" +caseContentData[i].Flag + ")";
                                    $ddl.append(formatLearnerChoiceItem(2, caseContentData[i].LabName, caseContentData[i].ContentItemID, temp));
                                    break;
                                case 4: // Drugs

                                    if (caseContentData[i].TradeName.toLowerCase().indexOf("missing") == -1){
                                        // var temp = caseContentData[i].TradeName + ", " +caseContentData[i].Strength + ", " +caseContentData[i].RouteOfAdministration + ", " +caseContentData[i].Frequency;
                                        var temp = caseContentData[i].TradeName;
                                        if (caseContentData[i].Strength != "") { temp += ", " + caseContentData[i].Strength; }
                                        if (caseContentData[i].RouteOfAdministration != "") { temp += ", " + caseContentData[i].RouteOfAdministration; }
                                        if (caseContentData[i].Frequency != "") { temp += ", " + caseContentData[i].Frequency; }
                                        $ddl.append(formatLearnerChoiceItem(2, caseContentData[i].TradeName, caseContentData[i].ContentItemID, temp));
                                    }
                                    break;
                                case 6: // Allergies
                                    var temp = decodeURI(caseContentData[i].AllergyDescription) + " (" +caseContentData[i].Severity + ")";
                                    $ddl.append(formatLearnerChoiceItem(2, decodeURI(caseContentData[i].AllergyDescription), caseContentData[i].ContentItemID, temp));
                                    break;
                                case 10: // Radiology
                                    var temp = decodeURI(caseContentData[i].RadiologyTestName);
                                    $ddl.append(formatLearnerChoiceItem(2, decodeURI(caseContentData[i].RadiologyTestName), caseContentData[i].ContentItemID, temp));
                                    break;

                            }
                        }
                    }
                
            }
        }


        sortSelect('#ddlLearnerChoiceSelector', 'text', 'asc');
                                    
        $('#learnerChoiceSelectorContainer').dialog({"title": "Select " +currentCategory.name });
        $('#learnerChoiceSelectorContainer').dialog("open");
    }
    
}

function cancelPlayerCategoryItem(contentItemID) {
    var cc = confirm("Are you sure you want to cancel this item?");
    if (cc) {
        alert("Item will be cancelled");
    }
}

function formatLearnerChoiceItem(source, group, id, label) {
    // $optgroup = $("<optgroup></optgroup>");
    // $optgroup.attr("label", group);
    $opt = $("<option></option>");
    $opt.attr({"value": id, "source": source});
    $opt.text(label);
    // $optgroup.append($opt);
    // return $optgroup;
    return $opt;
}

function saveSelectedLearnerChoice() {
    $selectObj = $("#ddlLearnerChoiceSelector option:selected");
    var selectedItemID = $selectObj.attr("value");

    // console.log(selectedItemID); /* DEBUG */

    var selectedContentItem = null;
    for (var i = 0; i < caseContentData.length; i++) {
        if (caseContentData[i].ContentItemID == selectedItemID) {
            selectedContentItem = caseContentData[i];
            break;
        }
    }

    // console.log("SELECTED ITEM"); /* DEBUG */
    // console.log(selectedContentItem); /* DEBUG */

    if (selectedContentItem != null) {

        if (selectedContentItem.NodeAutoID != "") {
            // updateModelStatesFromLearnerSelection(selectedContentItem.ContentItemID, selectedContentItem.NodeID, selectedContentItem.DefaultBnState)
            updateModelStatesFromLearnerSelection(selectedContentItem);
        }
        else {
            saveLearnerSelection(selectedContentItem.ContentItemID);
            // Add new data as a row to a corresponding table.
            // function loadContentItemRow is in player.js
            var tbl = $('#tblCategory' + selectedContentItem.CategoryID);
            var div = $('#divCategory' + selectedContentItem.CategoryID);
            var cols = categoryColumns["category" + selectedContentItem.CategoryID];
            var today = new Date();
            var eventDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            selectedContentItem[categoryDateFields["category" + selectedContentItem.CategoryID]] = eventDate;
            loadContentItemRow(selectedContentItem, tbl, div, cols, true);
        }
        checkMetricsRules();
        checkDistractorRules(selectedContentItem);
    }
    
    cancelSelectedLearnerChoice();
    
}

function cancelSelectedLearnerChoice() {
    $("#ddlLearnerChoiceSelector").empty();
    $('#learnerChoiceSelectorContainer').dialog("close");
}

function saveLearnerSelection(contentItemID) {
    var selectedLearnerNodeStates = {
        "contentItemID": contentItemID,
        "networkID": modelData.NetworkID,
        "caseID": caseID,
        "source": 2,
        "isActive": true,
        "dateCreated": getCurrentDateTimeMySqlFormat()
    }

    $.post("/Rest/SaveLearnerSelection",
        {
            "selectedLearnerNodeStates": JSON.stringify(selectedLearnerNodeStates)   
        },
        function (results) {
            // do nothing
        });
}


// function updateModelStatesFromLearnerSelection(contentItemID, nodeID, stateID) {
function updateModelStatesFromLearnerSelection(selectedContentItem) {
    contentItemID = selectedContentItem.ContentItemID;
    nodeID = selectedContentItem.NodeID;
    stateID = selectedContentItem.DefaultBnState;

    

    
    console.log("SELECTED ITEM"); /* DEBUG */
    console.log(selectedContentItem); /* DEBUG */

    var selectedLearnerNodeStates = {
        "contentItemID": contentItemID,
        "networkID": modelData.NetworkID,
        "caseID": caseID,
        "nodeID": nodeID,
        "stateID": stateID,
        "source": 1,
        "isActive": true,
        "dateCreated": getCurrentDateTimeMySqlFormat(),
        "affectedNodeStates": []
    }

    var temporalTier = 0;
    
    

    // This logic needs to be optimized - this is an unnecessary loop
    // We need to find the temporal tier of the selected node and only display nodes whose temporal tiers 
    // are less than or equal to current tier + 1
    for (var i = 0; i < modelData.Nodes.length; i++) {
        if (modelData.Nodes[i].ID == nodeID || modelData.Nodes[i].AutoID == nodeID) {
            temporalTier = modelData.Nodes[i].TemporalTier;
        }
    }
    
    // console.log(modelData.SelectedNodeStates);
    // console.log(selectedLearnerNodeStates);
    $.post("/Rest/UpdateModelStatesFromLearnerSelection", 
        {
            "networkID": modelData.NetworkID,
            "caseID": caseID,
            "selectedLearnerNodeStates": JSON.stringify(selectedLearnerNodeStates),
            "selectedNodesStates" : JSON.stringify(modelData.SelectedNodeStates)
        }, 
        function (updatedModel) {
            // console.log(updatedModel); /* DEBUG */

            var updatedNodes = [];
            // Iterate through the original model
            for(var i = 0; i < modelData.Nodes.length; i++) {
                // Iterate through the updated model
                for (var j = 0; j < updatedModel.Nodes.length; j++) {
                    if(updatedModel.Nodes[j].AutoID == modelData.Nodes[i].AutoID) {
                        // Compare node states
                        for (var key in modelData.Nodes[i].States) {
                            
                            if (modelData.Nodes[i].States.hasOwnProperty(key)) {
                                console.log(modelData.Nodes[i].States[key].StateProbability + " = " + updatedModel.Nodes[j].States[key].StateProbability);
                                if(parseFloat(modelData.Nodes[i].States[key].StateProbability) != parseFloat(updatedModel.Nodes[j].States[key].StateProbability)) {
                                    if (parseInt(modelData.Nodes[i].NodeType) == 2) {
                                        // console.log(modelData.Nodes[i].NodeLabel + ": " + key); /* DEBUG */
                                        // console.log("Changed: " + updatedModel.Nodes[j].NodeLabel); /* DEBUG */
                                        
                                        // console.log("Probability changed from " + modelData.Nodes[i].States[key].StateProbability + " to " + updatedModel.Nodes[j].States[key].StateProbability); /* DEBUG */
                                        updatedModel.Nodes[j].States[key].StateProbabilityChange = parseFloat(updatedModel.Nodes[j].States[key].StateProbability) / parseFloat(modelData.Nodes[i].States[key].StateProbability);
                                        // console.log("Probability change: " + updatedModel.Nodes[j].States[key].StateProbabilityChange); /* DEBUG */
                                        
                                       
                                        
                                        // console.log("NODE ID: " + updatedModel.Nodes[j].AutoID); /* DEBUG */
                                        console.log("State Key: " + key); /* DEBUG */

                                        
                                        if (modelData.Nodes[i].States[key].hasOwnProperty('CurrentValue')){
                                            console.log("FOUND"); /* DEBUG */
                                            var savedState = modelData.Nodes[i].States[key]; // double-check this logic
                                            console.log("Saved state: " + savedState); /* DEBUG */
                                            console.log("Old current value: " + savedState.CurrentValue); /* DEBUG */
                                            console.log("Default Value: " + updatedModel.Nodes[j].States[key].DefaultValue); /* DEBUG */
                                            updatedModel.Nodes[j].States[key].CurrentValue = parseFloat(savedState.CurrentValue) * parseFloat(updatedModel.Nodes[j].States[key].StateProbabilityChange);
                                        }
                                        else {
                                            console.log("NOT FOUND"); /* DEBUG */
                                            // *** If node key does not exist in outcomeNodeStateChangeLog, return default value of current updated node state
                                            console.log("Default Value: " + updatedModel.Nodes[j].States[key].DefaultValue);  /* DEBUG */
                                            if (jQuery.isNumeric(updatedModel.Nodes[j].States[key].DefaultValue)) {
                                                updatedModel.Nodes[j].States[key].CurrentValue = parseFloat(updatedModel.Nodes[j].States[key].DefaultValue) * parseFloat(updatedModel.Nodes[j].States[key].StateProbabilityChange);
                                            }
                                            else {
                                                updatedModel.Nodes[j].States[key].CurrentValue = updatedModel.Nodes[j].States[key].StateLabel;
                                            }

                                            if (updatedModel.Nodes[j].States[key].CurrentValue === Infinity) {
                                                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity
                                                updatedModel.Nodes[j].States[key].CurrentValue = updatedModel.Nodes[j].States[key].DefaultValue;
                                            }
                                        }
                                        console.log("Current Value: " + updatedModel.Nodes[j].States[key].CurrentValue);  /* DEBUG */
                                        console.log("_________________________________");  /* DEBUG */
                                        
                                    }

                                    // Create a list of nodes that have updated (changed) states
                                    if (!containsObject(updatedModel.Nodes[j], updatedNodes)){
                                        updatedNodes.push(updatedModel.Nodes[j]);
                                        
                                    }
                                    // break;
                                }

                            }
                        } // end "compare node states"
                    }

                    // Once finished iterating through all states and updating "current" values, store updated object in dictionary
                    // outcomeNodeStateChangeLog[updatedModel.Nodes[j].AutoID] = updatedModel.Nodes[j];

                } // end "Iterate through the updated model"
            } // end "Iterate through the original model"

            
            // Replace original model with the one with updated beliefs
            modelData = updatedModel;
            
            /*
            setTimeout(function () {
                updateEmrDisplayData(updatedNodes);
            }, 5000);
            */
            // checkModelRules(updatedNodes);
            checkModelRules(updatedNodes, selectedContentItem);
            updateEmrDisplayData(contentItemID, updatedNodes, selectedLearnerNodeStates, temporalTier);
        }
    );
}

function updateEmrDisplayData(selectedContentItemID, updatedNodes, selectedLearnerNodeStates, temporalTier) {
    // console.log(selectedLearnerNodeStates);

    var outcomesList = {};
    // NOTE: not the most efficient way of doing things, will have to be re-written
    var selectedContentItemNodeID = ""; // Corresponding node ID in the model for the content item selected by learner
    var caseContentDataGrouped = []; /* Because for presentation purposes we can have multiple content items representing a 
                                        single BN model node, we need to group them.  In other words, only the content item
                                        selected by learner should be displayed.  If there are more content items representing
                                        other states from the same node, they should be ignored.  
                                        ********* THIS LOGIC NEEDS TO BE REFACTORED **************/

    // Find corresponding node ID in the model for the content item selected by learner
    for (var x = 0; x < caseContentData.length; x++) {
        if (caseContentData[x].ContentItemID == selectedContentItemID) {
            selectedContentItemNodeID = caseContentData[x].NodeAutoID;
            caseContentDataGrouped.push(caseContentData[x]); // Add item to the GROUPED list
            break;
        }
    }

    // Find all items where the node ID from the BN model does not match the one
    // selected by learner.  Add all the other items to the GROUPED list
    for (var x = 0; x < caseContentData.length; x++) {
        if (caseContentData[x].NodeAutoID != selectedContentItemNodeID) {
            caseContentDataGrouped.push(caseContentData[x]);
        }
    }


    /* DEBUG */
    // console.log("Selected Content Node ID: " + selectedContentItemNodeID);
    // console.log(caseContentDataGrouped);

    // Add row to table for display
    for(var i = 0; i < updatedNodes.length; i++) {
        // Find corresponding item ID
        for (var j = 0; j < caseContentDataGrouped.length; j++) {
            
            if (caseContentDataGrouped[j].NodeAutoID == updatedNodes[i].AutoID) {
                
                // console.log("MATCHED: " + caseContentDataGrouped[j].NodeAutoID); /* DEBUG */

                /******************************************************************************
                Identify states swith highest probabilities for each node.
                Iterate through each node that was affected by learner's choice and select
                a state that has the highest probability value.  
                *******************************************************************************/
                prevState = {"state": "", "probability": 0}; // initialize previous state 
                for (key in updatedNodes[i].States) {
                    if (parseFloat(prevState.probability) < parseFloat(updatedNodes[i].States[key].StateProbability)) {
                        prevState.state = updatedNodes[i].States[key].StateName; // compare to previous state in the list
                        prevState.probability = updatedNodes[i].States[key].StateProbability;
                    }
                }

                /****
                Note: This needs to be tested very carefully.  I think that selectedLearnerNodeStates
                is within scope of this code, but it might not be.
                Actually, I may not need this at all!
                ****/
                var updatedState = {}
                updatedState[updatedNodes[i].ID] = prevState.state;
                selectedLearnerNodeStates.affectedNodeStates.push(updatedState);

                /* DEBUG */
                /*
                if(updatedNodes[i].NodeType == 2){
                    console.log("STATE WITH HIGHEST PROBABILITY FOR: " + updatedNodes[i].NodeLabel);
                    console.log(updatedNodes[i].States[prevState.state]);
                    console.log(caseContentDataGrouped[j]);
                }
                */
                
                /*
                The idea behind the following logic is that the system should not allow learners to see how each choice affects the
                entire network.  We want choices to only affect the immediate children.  However, in user testing, a number of users
                mentioned that they would like to control how far down the network tree each choice's effects are reflected.
                I copied the temporal tier idea from GeNIe.  The basic idea is that each node is associated with a temporal tier - a
                grouping showing where the node(s) occur in the timeline of the case.  Changes triggered by learners' choices only affect
                nodes in the temporal tier(s) that are equal to or less then the temporal tier of the changed node + 1.
                */
                var curNodeTemporalTier = parseInt(updatedNodes[i].TemporalTier);
                var temporalTierBoundary = parseInt(temporalTier) + 1;

                /* DEBUG */
                // console.log(updatedNodes[i].NodeLabel + " temporal tier: " + curNodeTemporalTier + "; Boundary = " + temporalTierBoundary);

                /*
                Note: we only want to show changes in outcome nodes - in other words, nodes where NodeType = 2
                The exception to this rule is for nodes that were selected by learner.  For example, if learner selects a drug that is a decision node,
                not an outcome node, we still add it to the display of selected / outcome items in the appropriate section
                */
                // console.log(caseContentDataGrouped[j]); /* DEBUG */

                
                if (((curNodeTemporalTier <= temporalTierBoundary) && (parseInt(caseContentDataGrouped[j].NodeType) == 2)) || (caseContentDataGrouped[j].NodeAutoID == selectedContentItemNodeID)) {
                    
                    if (prevState.state != "missing") {
                        // Add new data as a row to a corresponding table.
                        // function loadContentItemRow is in player.js
                        var tbl = $('#tblCategory' + caseContentDataGrouped[j].CategoryID);
                        var div = $('#divCategory' + caseContentDataGrouped[j].CategoryID);
                        var cols = categoryColumns["category" + caseContentDataGrouped[j].CategoryID];
                        var today = new Date();
                        var eventDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                        caseContentDataGrouped[j][categoryDateFields["category" + caseContentDataGrouped[j].CategoryID]] = eventDate;
                        switch (parseInt(caseContentDataGrouped[j].CategoryID)) {
                            case 0:
                                if (caseContentDataGrouped[j].NodeAutoID in outcomesList) {
                                    // console.log("FOUND: " + caseContentDataGrouped[j]); /* DEBUG */
                                    outcomesList[caseContentDataGrouped[j].NodeAutoID].NoteText += ", the probability of " + caseContentDataGrouped[j].OutcomeLabel
                                    + " is " + (roundNumber(updatedNodes[i].States[caseContentDataGrouped[j].DefaultBnState].StateProbability) * 100) + "%";
                                }
                                else {
                                    // console.log("NOT FOUND: " + caseContentDataGrouped[j]); /* DEBUG */
                                    caseContentDataGrouped[j].NoteText = "Based on the outcomes of your decisions, the probability of " + caseContentDataGrouped[j].OutcomeLabel
                                    + " is " + (roundNumber(updatedNodes[i].States[caseContentDataGrouped[j].DefaultBnState].StateProbability) * 100) + "%";
                                    outcomesList[caseContentDataGrouped[j].NodeAutoID] = caseContentDataGrouped[j];

                                }
                                
                                break;
                            case 3:
                                caseContentDataGrouped[j].Low = updatedNodes[i].States[prevState.state].LowerRange;
                                caseContentDataGrouped[j].High = updatedNodes[i].States[prevState.state].UpperRange;
                                caseContentDataGrouped[j].Result = roundNumber(updatedNodes[i].States[prevState.state].CurrentValue);
                                break;
                            case 11:
                                caseContentDataGrouped[j].VitalValue = roundNumber(updatedNodes[i].States[prevState.state].CurrentValue);
                                break;
                        }

                        if (parseInt(caseContentDataGrouped[j].CategoryID) != 0) {
                            
                            loadContentItemRow(caseContentDataGrouped[j], tbl, div, cols, true);
                            // Display notification icon
                            addNotificationIconToCategory(updatedNodes[i].CategoryID);
                        }
                        
                    }
                }

            }


        }
       
    }

    for (var key in outcomesList) {
        var tbl = $('#tblCategory0');
        var div = $('#divCategory0');
        var cols = categoryColumns["category0"];
        // check if the property/key is defined in the object itself, not in parent
        if (outcomesList.hasOwnProperty(key)) {
            loadContentItemRow(outcomesList[key], tbl, div, cols, true);
            addNotificationIconToCategory(0);
        }
    }
}

function runFakeProgressBar() {

}

function addNotificationIconToCategory(categoryID) {
    /*
    $img = $("<img />");
    $img.attr({
                "src": "../Images/Icons/notification-512.png",
                "class": "notificationIcon"
    });
    */
    var notificationIcon = null;
    if($("#notificationIcon" +categoryID).get(0)) {
        notificationIcon = $("#notificationIcon" +categoryID);
        var val = parseInt(notificationIcon.html()) + 1;
        notificationIcon.html(val);
    }
    else{
        notificationIcon = $("<div></div>"); // Notification icon
        notificationIcon.attr({
            "id": "notificationIcon" +categoryID,
            "class": "notificationIcon"
        });
        notificationIcon.html("1");
    }
    $("#playerCategory" +categoryID).append(notificationIcon);
}

/* 
Run through the entire model and check if any of the states match rule criteria.
For this we only care about updated nodes.
*/
function checkModelRules(updatedModelNodes, selectedContentItem) {
    
    /*
    for (var i = 0; i < updatedModelNodes.length; i++) {
        for (var j = 0; j < caseRules.length; j++) {
            if (caseRules[j].triggerVariableID == updatedModelNodes[i].AutoID) {
                var selectedStateID = findMostProbableState(updatedModelNodes[i].States);
                if (selectedStateID == caseRules[j].triggerValueID){
                    // console.log("Fire rule for " + updatedModelNodes[i].NodeLabel + ", state = " + caseRules[j].triggerValueLabel);
                    triggerRuleOutcome(caseRules[j]);
                }
            }selectedContentItem
        }
    }
    */
    for (var j = 0; j < caseRules.length; j++) {
        // console.log(caseRules[j].triggerVariableID + " = " + selectedContentItem.NodeAutoID); /* DEBUG */
        if (caseRules[j].triggerVariableID == selectedContentItem.NodeAutoID) {
            // if (selectedContentItem.DefaultBnState == caseRules[j].triggerValueID) {
                
            triggerRuleOutcome(caseRules[j], selectedContentItem);
            // }
        }
    }

}

function checkTimeElapsedRules() {
    timeElapsed++;
    if (ruleTimeElapsedIndexes.includes(timeElapsed)) {
        console.log(timeElapsed);
        for (var i = 0; i < caseRules.length; i++) {
            if ((parseInt(caseRules[i].triggerType) == 4) && (parseInt(caseRules[i].triggerValueNumeric) == timeElapsed)) {
                // decisionCount++;
                triggerRuleOutcome(caseRules[i], null);
            }
        }
    }
    
}

/* 
Distractor changed - since changing a distractor value does not affect BN model,
there is no need to iterate through all distractors. We only need to check if the 
distractor changed by learner selection triggers a rule
*/
function checkDistractorRules(selectedContentItem) {
    
    // console.log(selectedContentItem); /* DEBUG */
    for (var i = 0; i < caseRules.length; i++) {
        if ((parseInt(caseRules[i].triggerType) == 3) && (caseRules[i].triggerVariableID == selectedContentItem.ContentItemID)) {
            triggerRuleOutcome(caseRules[i], selectedContentItem);
        }
    }
}

/*
Check for rules that deal with changes in metrics
*/
function checkMetricsRules() {

    for (var i = 0; i < caseRules.length; i++) {
        for (var j = 0; j < caseMetrics.length; j++) {
            if (caseRules[i].triggerVariableID == caseMetrics[j].MetricID) {
                /* DEBUG */
                // console.log("Found metric-based rule");
                // console.log(caseRules[i]);
            }
        }
    }
}


function triggerRuleOutcome(ruleObj, selectedItemObject) {
    
    switch (parseInt(ruleObj.outcomeType)) {
        case 1:
            updateNodeStateWithRule(ruleObj.outcomeVariableID, ruleObj.outcomeValueID);
            break;
        case 2:
            // Change metric value
            updateMetric(ruleObj.outcomeVariableID, ruleObj.assignmentOperand, ruleObj.outcomeValueNumeric)
            break;
        case 3:
            // Provide feedback
            if (selectedItemObject != null) {
                showFeedback("Decision/choice: <b>" + selectedItemObject.Label + "</b>.<br /><br />" + ruleObj.outcomeFeedback);
            }
            else {
                showFeedback(ruleObj.outcomeFeedback);
            }
            break;
        case 4:
            // Change distractor value
            // console.log(ruleObj);
            updateDistractorWithRule(ruleObj.outcomeVariableID, ruleObj.outcomeValueLabel);
            break;
        case 5:
            selectorTemporalTier += 1;
            // addCategoryItem();

    }
}

function updateDistractorWithRule(distractorID, newDistractorValue) {
    // Find distractor
    var changeContentItem = null;
    for (var i = 0; i < caseContentData.length; i++) {
        if (caseContentData[i].ContentItemID == distractorID) {
            changeContentItem = caseContentData[i];
            break;
        }
    }

    if (changeContentItem != null) {
        switch (parseInt(changeContentItem.CategoryID)) {
            case 0:
                changeContentItem.NoteText = newDistractorValue;
            case 3:
                changeContentItem.Result = newDistractorValue;
                break;
            case 11:
                changeContentItem.VitalValue = newDistractorValue;

                break;
        }

        var tbl = $('#tblCategory' + changeContentItem.CategoryID);
        var div = $('#divCategory' + changeContentItem.CategoryID);
        var cols = categoryColumns["category" + changeContentItem.CategoryID];
        var today = new Date();
        var eventDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        changeContentItem[categoryDateFields["category" + changeContentItem.CategoryID]] = eventDate;

        loadContentItemRow(changeContentItem, tbl, div, cols, true);

        // Display notification icon
        addNotificationIconToCategory(changeContentItem.CategoryID);
    }
}

function updateNodeStateWithRule(targetNodeID, targetStateID) {
    var contentItemID = "";
    // This needs to be optimized.  updateModelStatesFromLearnerSelection() already
    // iterates through caseContentData - need to move this logic into updateModelStatesFromLearnerSelection()
    // and just do it once.
    for (var i = 0; i < caseContentData.length; i++) {
        if (caseContentData[i].NodeAutoID == targetNodeID) {
            // contentItemID = caseContentData[i].ContentItemID;
            updateModelStatesFromLearnerSelection(caseContentData[i]);
            break;
        }
    }
    /*
    if (contentItemID != "") {
        updateModelStatesFromLearnerSelection(contentItemID, targetNodeID, targetStateID);
    }
    */
}
/***********************************************************************************************
NOTE: 10/10/2017
Progress bars aren't being updated correctly - needs to be fixed.  So far metrics updates are working.  
Feedback is working, but needs to be formatted nicely and automatically added to Notes.
***********************************************************************************************/
function updateMetric(metricID, operand, val) {
    for (var i = 0; i < caseMetrics.length; i++) {
        if (caseMetrics[i].MetricID == metricID) {
            switch(operand){
                case "+":
                    caseMetrics[i].CurrentValue = parseFloat(caseMetrics[i].CurrentValue) + parseFloat(val);
                    break;
                case "-":
                    caseMetrics[i].CurrentValue = parseFloat(caseMetrics[i].CurrentValue) - parseFloat(val);
                    break;
                case "=":
                    caseMetrics[i].CurrentValue = parseFloat(val);
                    break;
                case "*":
                    caseMetrics[i].CurrentValue = parseFloat(caseMetrics[i].CurrentValue) * parseFloat(val);
                    break;
                case "/":
                    caseMetrics[i].CurrentValue = parseFloat(caseMetrics[i].CurrentValue) / parseFloat(val);
                    break;
            }

            /* DEBUG */
            // alert(caseMetrics[i].MetricName + ": " + caseMetrics[i].CurrentValue);

            $("#metric_" + caseMetrics[i].MetricID).progressbar({
                value: parseInt(caseMetrics[i].CurrentValue)
            });
            // alert($("#metric_" + caseMetrics[i].MetricID).progressbar("value"));
            // console.log(caseMetrics[i]);
        }
    }
}

function showFeedback(feedbackText) {
    var contentObj = {};
    contentObj.Label = "Note";
    contentObj.NoteDate = getCurrentDate();
    contentObj.NoteText = feedbackText;
    contentObj.IsPriorHistory = "Yes";
    contentObj.TemporalTier = 0;
    contentObj.Group = "";
    contentObj.CaseID = caseID; // Each content object must be associated with a caseID
    contentObj.NodeAutoID = "";
    contentObj.NodeID = "";
    contentObj.CategoryID = 8;

    // Add new data as a row to a corresponding table.
    // function loadContentItemRow is in player.js
    var tbl = $('#tblCategory8');
    var div = $('#divCategory8');
    var cols = categoryColumns["category8"];
    var today = new Date();
    var eventDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    contentObj[categoryDateFields["category" + contentObj.CategoryID]] = eventDate;
    loadContentItemRow(contentObj, tbl, div, cols, false);
    // Display notification icon
    addNotificationIconToCategory(8);

    $('#feedbackContainer').html(feedbackText);
    $('#feedbackContainer').dialog({ "title": "Note" });
    $('#feedbackContainer').dialog("open");
}

function findMostProbableState(statesDictionary) {
    var max = 0;
    var stateID = "";
    for (var state in statesDictionary) {
        // check if the property/key is defined in the object itself, not in parent
        if (statesDictionary.hasOwnProperty(state)) {
            if (parseFloat(statesDictionary[state].StateProbability) > max) {
                max = parseFloat(statesDictionary[state].StateProbability);
                stateID = statesDictionary[state].StateAutoID;
            }
        }
    }
    return stateID;
}

function logEvent(selectedCategory) {
    var eventData = {
        "categoryID": selectedCategory.id,
        "categoryName": selectedCategory.name,
        "caseID": caseID,
        "logDateTime": new Date()
    }
    $.post("/Rest/LogEvent", { "eventData": JSON.stringify(eventData) }, function (evt) {
        console.log(evt);
    });
}

