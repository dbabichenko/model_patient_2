var caseID = ""; // Unique identifier for the current VP case
var networkID = ""; // Unique identifier for the BN model associated with VP case
var caseData = null; // Object that will hold core VP case data
var modelData = null; // Object that will hold BN model nodes and edges
var caseContentData = null; // Object that will hold case content data
var categoryModels = {}; 
var currentCategory = 9; // Current category - the category that's currently being displayed in the EMR (ex: Demographic or Diagnoses)
var drugs = null; // List of searchable FDA-approved drugs
var dx = null; // List of ICD-10 diagnosis with codes
var procs = null; // List of ICD-10 procedures with codes

$(document).ready(function () {
    caseID = getUrlParameterByName("caseID");
    networkID = getUrlParameterByName("networkID");

    renderCaseEditorNavButtons(2, caseID, networkID); // Render navigation buttons in the footer
    createPlayerEditorNavLinks(caseID, networkID);

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

                    // Configure model popups
                    $('.playerCategoryItemEditor').dialog({ autoOpen: false, width: 700 });
                    $('#frmImageUploader').dialog({ autoOpen: false, width: 400 });
                    
                    // By default, display "Demographic" data in the EMR view
                    
                    loadPlayerCategory(9);
                });
                
            }
        });
    }
    for (var z = 0; z < eventCategories.length; z++) {
        var tableID = "tblCategory" + eventCategories[z].id;
        // $("#" + tableID).sortable();
        // $("#" + tableID).disableSelection();
    }
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
                loadContentItemRow(ccd[i], tbl, div, cols);
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
Return:         n/a
**************************************************************************************************************************************/
function loadContentItemRow(contentItem, tbl, div, cols) {
    
    var tr = $('<tr></tr>');
    tr.attr("id", "tr_" + contentItem.ContentItemID);
    var td = null;
    
    for (var i = 0; i < cols.length; i++) {
        td = $('<td></td>');
        var cellContent = contentItem[cols[i]];
        try {
            cellContent = decodeURI(cellContent);
        }
        catch(err) {
            // do nothing 
        }
        if (! contentItem.hasOwnProperty(cols[i])) {
            cellContent = "";
        }
        td.html(cellContent);
        tr.append(td);
    }

    // Add cells for edit and delete buttons
    td = $('<td></td>');
    td.html("<a href=javascript:editPlayerCategoryItem('" + contentItem.ContentItemID + "');>[edit]</a>");
    tr.append(td);

    td = $('<td></td>');
    td.html("<a href=javascript:deletePlayerCategoryItem('" + contentItem.ContentItemID + "');>[delete]</a>");
    tr.append(td);

    // Add cells for icons
    td = $('<td></td>');
    if (contentItem.NodeID != "") {
        if (modelData.SelectedNodeStates.hasOwnProperty(contentItem.NodeID)) {
            td.html("<img src='/Images/Icons/network_small_red.png' width='50' height='50' title='This data was chosen as initial condition for this case in the VP model' />");
        }
        else{
            td.html("<img src='/Images/Icons/network_small.png' width='50' height='50' title='This data comes from the VP model - you can edit it for better presentation and either set it as a prior condition / patient history, or let learners select it as one of the choices.' />");
        }
    }
    else {
        td.html("<img src='/Images/Icons/unknown_small.png' width='50' height='50' title='Distractor item / option' />");
    }
    tr.append(td);

    tbl.append(tr);
}

/**************************************************************************************************************************************
Function:       existsContentItemByNodeID
Description:    Checks if a BN model node has associated data in "casecontent" MongoDB collection (represented by caseContentData var)
Argument(s):    nodeID -    Unique identifier (AutoID) for a BN model node
Return:         boolean -   true if associated case content exists
                            false if there is no associated content
**************************************************************************************************************************************/
function existsContentItemByNodeID(nodeID) {
    // console.log("NODE ID: " + nodeID);
    for (var i = 0; i < caseContentData.length; i++) {
        
        if (caseContentData[i].NodeAutoID == nodeID) {
            // console.log("HERE: " + caseContentData[i]); /* DEBUG */
            return true; // associated case content exists
        }
    }
    return false; // there is no associated content
}


/**************************************************************************************************************************************
Function:       getNodeDefaultState
Description:    BN nodes that have been set as initial states for the VP case have an property object that represents default states
                for that node and the state's associated probabilities.
Argument(s):    node    -       BN node object from modelData 
Return:         defaultValueState - entire object for the node's selected (default) state
**************************************************************************************************************************************/
function getNodeDefaultState(node) {
    var nodeDefaultState = null;
    if (node.States.hasOwnProperty(modelData.SelectedNodeStates[node.ID])) {
        nodeDefaultState = node.States[modelData.SelectedNodeStates[node.ID]];
    }
    return nodeDefaultState;
}


/**************************************************************************************************************************************
Function:       editPlayerCategoryItem
Description:    This function is called when author needs to edit a case content item.
Argument(s):    contentItemID    -  Unique identifier for case content item
Return:         N/A
**************************************************************************************************************************************/
function editPlayerCategoryItem(contentItemID) {
    var contentItem = null;
    var contentSource = "case";
    
    // Check for items in case content data.  If contentItemID is actually a nodeID, nothing will be found
    for (var i = 0; i < caseContentData.length; i++) {
        if ((caseContentData[i].ContentItemID == contentItemID) || (caseContentData[i].NodeAutoID == contentItemID)) {
            contentItem = caseContentData[i];
            break;
        }
    }

    

    console.log(contentItem);  /* DEBUG */

    
    setNodeAndContentIDs(contentItem.ContentItemID, contentItem.NodeAutoID, contentItem.NodeID);
    // console.log(contentItem.NodeAutoID); /* DEBUG */
    
    
    /* 
        There is probably a better way of doing this with data binding, but I don't have time to refactor now.
        The switch statement below loads case content item data into a modal popup editor.
    */
    if (contentItem) {
        switch (parseInt(contentItem.CategoryID)) {
            case 0: // Uncategorized / Other
                $("#txtOtherNoteDate").datepicker();
                $("#txtOtherNoteDate").val(contentItem.NoteDate);
                initRTE("txtOtherNoteText");
                $('#txtOtherNoteText').val(decodeURI(contentItem.NoteText));
                $('#txtOtherOutcomeLabel').val(decodeURI(contentItem.OutcomeLabel));
                $("#ddlIncludeOtherPriorHistory").val(contentItem.IsPriorHistory);
                break;
            case 1: // Diagnoses
                $("#txtDxDate").datepicker();
                $("#txtDxResolvedDate").datepicker();
                $("#txtDxNameSearch").val(contentItem.DiagnosisName);
                $("#txtDxName").val(contentItem.DiagnosisName);
                $("#txtDxIcd10Code").val(contentItem.ICD10Code);
                $("#txtDxCategory").val(contentItem.CategoryName);
                $("#txtDxDate").val(contentItem.DiagnosisDate);
                $("#txtDxResolvedDate").val(contentItem.DiagnosisResolvedDate);
                $("#txtDxTemporalTier").val(contentItem.TemporalTier);
                $("#txtDxGroup").val(contentItem.Group);
                $("#ddlIncludeDxPriorHistory").val(contentItem.IsPriorHistory);
                break;
            case 2: // Procedures
                $("#txtProcDate").datepicker();
                $("#txtProcNameSearch").val(contentItem.ProcedureName);
                $("#txtProcDate").val(contentItem.ProcedureDate);
                $("#txtProcResults").val(contentItem.ProcedureResults);
                $("#txtProcTemporalTier").val(contentItem.TemporalTier);
                $("#txtProcGroup").val(contentItem.Group);
                break;
            case 3: // Labs
                $("#txtOrderDate").datepicker();
                $("#txtOrderDate").val(contentItem.OrderDate);
                $("#txtLabName").val(contentItem.LabName);
                $("#txtResult").val(contentItem.Result);
                $("#txtUnits").val(contentItem.Units);
                $("#txtLow").val(contentItem.Low);
                $("#txtHigh").val(contentItem.High);
                $("#ddlFlag").val(contentItem.Flag);
                $("#ddlIncludeLabsPriorHistory").val(contentItem.IsPriorHistory);
                $("#txtLabsTemporalTier").val(contentItem.TemporalTier);
                $("#txtLabsGroup").val(contentItem.Group);
                break;
            case 4: // Drugs
                $("#txtDrugStartDate").datepicker();
                $("#txtDrugStopDate").datepicker();
                $("#txtDrugName").val(contentItem.TradeName);
                $("#txtIngridient").val(contentItem.Ingredient);
                $("#txtDosageForm").val(contentItem.DosageForm);
                $("#txtRouteOfAdmin").val(contentItem.RouteOfAdministration);
                $("#txtDrugStrength").val(contentItem.Strength);
                $("#txtDrugFrequency").val(contentItem.Frequency);
                $("#txtDrugStartDate").val(contentItem.StartDate);
                $("#txtDrugStopDate").val(contentItem.StopDate);
                $("#ddlIncludeDrugPriorHistory").val(contentItem.IsPriorHistory);
                $("#txtDrugTemporalTier").val(contentItem.TemporalTier);
                $("#txtDrugGroup").val(contentItem.Group);
                break;
            case 5: // Encounters
                $("#txtEncounterDate").datepicker();
                $("#txtEncounterDate").val(contentItem.EncounterDate);
                $("#ddlEncounterType").val(contentItem.EncounterType);
                $("#txtEncounterReason").val(decodeURI(contentItem.EncounterReason));
                $("#txtEncounterNotes").val(decodeURI(contentItem.EncounterNotes));
                $("#txtEncounterTemporalTier").val(contentItem.TemporalTier);
                $("#txtEncounterGroup").val(contentItem.Group);
                break;
            case 6:
                $("#txtAllergyDate").datepicker();
                $("#txtAllergyDate").val(contentItem.AllergyDate);
                $("#txtAllergyDescription").val(decodeURI(contentItem.AllergyDescription));
                $("#txtAdverseReaction").val(decodeURI(contentItem.AdverseReaction));
                $("#ddlSeverity").val(contentItem.Severity);
                $("#ddlIncludeAllergyPriorHistory").val(contentItem.IsPriorHistory);
                $("#txtAllergyTemporalTier").val(contentItem.TemporalTier);
                $("#txtAllergyGroup").val(contentItem.Group);
                
                break;
            case 7: // Social
                $("#txtSocialNoteDate").datepicker();
                $("#txtSocialNoteDate").val(contentItem.NoteDate);
                $("#txtSocialNoteText").val(contentItem.NoteText);
                $("#txtSocialTemporalTier").val(contentItem.TemporalTier);
                break;
            case 8:
                $("#txtNoteDate").datepicker();
                initRTE("txtNoteText");
                $("#txtNoteDate").val('');
                break;
            case 9: // Demographic data
                initRTE("txtDemographicValue", 200);
                $("#txtDemographicLabel").val(contentItem.DemographicLabel);
                $("#txtDemographicValue").val(decodeURI(contentItem.DemographicValue));
                tinymce.get('txtDemographicValue').setContent(decodeURI(contentItem.DemographicValue));
                $("#txtDemographicTemporalTier").val(contentItem.TemporalTier);
                break;
            case 10: // Radiology
                $("#txtRadiologyNoteDate").datepicker();
                initRTE("txtRadiologyNoteText");
                $("#txtRadiologyNoteDate").val(contentItem.NoteDate);
                $("#txtRadiologyNoteText").val(decodeURI(contentItem.NoteText));
                $("#txtRadiologyTestName").val(contentItem.RadiologyTestName);
                $("#ddlIncludeRadiologyPriorHistory").val(contentItem.IsPriorHistory);
                $("#txtRadiologyTemporalTier").val(contentItem.TemporalTier);
                $("#txtRadiologyGroup").val(contentItem.Group);
                break;

            case 11: // Vitals
                $("#txtVisitDate").datepicker();
                $("#txtVisitDate").val(contentItem.VisitDate);
                $("#txtVitalName").val(contentItem.VitalName);
                $("#txtVitalValue").val(contentItem.VitalValue);
                $("#ddlIncludeVitalsPriorHistory").val(contentItem.IsPriorHistory);
                $("#txtVitalTemporalTier").val(contentItem.TemporalTier);
                break;
        }
    }

    // Add node state selector to the editor window
    addBnNodeStateSelector(contentItem.NodeAutoID);
    addBnNodeTypeSelector(contentItem.NodeAutoID);

    // Set default state for node
    if (contentItem.DefaultBnState == "" || !contentItem.DefaultBnState) {
        // Default state has not been set
        if (modelData.SelectedNodeStates.hasOwnProperty(contentItem.NodeID)) {
            // If node has been selected as "initial case state" or "prior history"
            // in bn editor (GraphViewer.aspx & grapheditor.js), set the dropdown value to that state

            // console.log(modelData.SelectedNodeStates.hasOwnProperty(contentItem.NodeID)); /* DEBUG */
            $("#bnNodeStateSelector").val(modelData.SelectedNodeStates[contentItem.NodeID]);
        }
    }
    else {
        // Set the dropdown value to previously selected state
        $("#bnNodeStateSelector").val(contentItem.DefaultBnState);
    }

    // Set node type
    $("#bnNodeTypeSelector").val(contentItem.NodeType);
    

    // Open modal popup for the editor
    $('#playerCategoryItemEditor' + currentCategory.id).dialog({"title": "Edit " + currentCategory.name + " Item"});
    $('#playerCategoryItemEditor' + currentCategory.id).dialog("open");
}


/**************************************************************************************************************************************
Function:       addBnNodeStateSelector
Description:    When editor is open, if the content item is associated with a BN model node (linked via node ID),
                this function creates and displays a dropdown list (<select>) of all possible states of the 
                associated BN node
Argument(s):    nodeID  -  Unique of associated BN node object (Node.AutoID)                
Return:         N/A
**************************************************************************************************************************************/

function addBnNodeStateSelector(nodeID) {
    // Remove current select element (if exists)
    try{
        $("#bnNodeStateSelectorRow").remove();
    }
    catch(err){
        // do nothing for now
    }
    
    var node = null; // Initialize node object

    if (nodeID != "") {
        // Find node object in model 
        // NOTE: OPTIMIZE THIS! 
        for (var i = 0; i < modelData.Nodes.length; i++) {
            if (modelData.Nodes[i].AutoID == nodeID) {
                node = modelData.Nodes[i];
                break;
            }
        }

        // If node object found
        if (node != null) {
            var ddl = $("<select></select>"); // Create dropdown
            ddl.attr({
                "id": "bnNodeStateSelector",
                "class": "form-control"
            });
            // Add option items to dropdown
            for (var stateID in node.States) {
                var opt = $("<option></option>");
                opt.attr({
                    "value" : stateID
                });
                opt.text(stateID);
                ddl.append(opt);
            }

            // Add dropdown as a first row to the table of form controls
            var tbl = $('#playerCategoryItemEditor' + currentCategory.id).find("table");
            var tr = $("<tr></tr>");
            tr.attr("id", "bnNodeStateSelectorRow");
            var td = $("<td></td>");
            td.html("Default state")
            tr.append(td)
            td = $("<td></td>");
            td.append(ddl);
            tr.append(td);
            tbl.prepend(tr);
            // If node already has a state selected using the BN editor (GraphViewer.aspx & grapheditor.js)
            // highlight the dropdown list to make it look disabled. 
            // NOTE:  FIGURE OUT HOW TO ACTUALLY DISABLE IT WHILE STILL KEEPING IT READABLE!!!
            if (modelData.SelectedNodeStates.hasOwnProperty(node.ID)) {
                ddl.css("background-color", "#c3c3c3"); // Set background color to "gray"
            }
        }
    }
}

function addBnNodeTypeSelector(nodeID) {
    
    // Remove current select element (if exists)
    try {
        $("#bnNodeTypeSelectorRow").remove();
    }
    catch (err) {
        // do nothing for now
    }

    
    var ddl = $("<select></select>"); // Create dropdown
    ddl.attr({
        "id": "bnNodeTypeSelector",
        "class": "form-control"
    });
    // Add option items to dropdown
    for (var nodeType in nodeTypes) {
        var opt = $("<option></option>");
        opt.attr({
            "value": nodeTypes[nodeType]
        });
        opt.text(nodeType);
        ddl.append(opt);
    }

    // Add dropdown as a first row to the table of form controls
    var tbl = $('#playerCategoryItemEditor' + currentCategory.id).find("table");
    var tr = $("<tr></tr>");
    tr.attr("id", "bnNodeTypeSelectorRow");
    var td = $("<td></td>");
    td.html("Node Type")
    tr.append(td)
    td = $("<td></td>");
    td.append(ddl);
    tr.append(td);
    tbl.prepend(tr);
            
        
    
}


/**************************************************************************************************************************************
Function:       setNodeAndContentIDs
Description:    Editor needs to know which content item is being edited and whether or not that item is a BN node or 
                a case content item. This function sets contentItemID and networkNodeID for each edited case item.
                If contentItemID is empty, it's a new item (create).  If contentItemID is not empty, update existing item.
Argument(s):    cID: contentItemID    -  Unique identifier for case content item
                nAutoID: networkNodeAutoID    - Node.AutoID property of associated BN node object
                nID: networkNodeID    - Node.ID property of associated BN node object
Return:         N/A
**************************************************************************************************************************************/
function setNodeAndContentIDs(cID, nAutoID, nID) {
    $("#currentContentItemID").val(cID);
    $("#currentNetworkNodeID").val(nID);
    $("#currentNetworkNodeAutoID").val(nAutoID);
}


/**************************************************************************************************************************************
Function:       deletePlayerCategoryItem
Description:    Deletes a single content item from database and removes associated HTML table row
Argument(s):    contentItemID    -  Unique identifier for case content item
Return:         N/A
**************************************************************************************************************************************/
function deletePlayerCategoryItem(contentItemID) {
    var cc = confirm("Are you sure you want to delete this item?  This action cannot be undone!");
    if (cc) {
        var tr = $("#tr_" + contentItemID);
        if (tr) {
            // ************ NOTE: Need error handling here *********************
            $.post("/Rest/DeleteContentItem?contentItemID=" + contentItemID, function (response) {
                for (var i = 0; i < caseContentData.length; i++) {
                    if (caseContentData[i].ContentItemID == contentItemID) {
                        caseContentData.splice(i, 1);
                        break;
                    }
                }
                tr.remove();
            });
        }
    }
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
        $('#btnAddItem').val("Add " + currentCategory.name); /* There is a button for adding new content item to 
                                                                each category - rename that button according to the currently
                                                                selected category (ex: Add diagnosis) */

        // Make HTML table for the currently selected category visible
        $('#divCategory' + currentCategory.id).css({
            "display": "block",
            "visibility": "visible"
        });

    }

}

/**************************************************************************************************************************************
Function:       addCategoryItem
Description:    Whenever new case content item is being edited, we need to make sure that previous values have been cleared.  The only 
                purpose of this function is to reset edit forms in the modal popup used for editing and creating case content items.
Argument(s):    N/A
Return:         N/A
**************************************************************************************************************************************/
function addCategoryItem() {
    // console.log(currentCategory.id); /* DEBUG */

    try {
        $("#bnNodeStateSelectorRow").remove();
    }
    catch (err) {
        // do nothing for now
    }

    switch (currentCategory.id) {
        case 4: // Drugs
            $("#txtDrugStartDate").datepicker();
            $("#txtDrugStopDate").datepicker();
            $("#txtDrugName").val('');
            $("#txtIngridient").val('');
            $("#txtDosageForm").val('');
            $("#txtRouteOfAdmin").val('');
            $("#txtDrugStrength").val('');
            $("#txtDrugFrequency").val('');
            $("#txtDrugStartDate").val('');
            $("#txtDrugStopDate").val('');
            break;
        case 1: // Diagnoses
            $("#txtDxDate").datepicker();
            $("#txtDxResolvedDate").datepicker();
            $("#txtDxNameSearch").val('');
            $("#txtDxName").val('');
            $("#txtDxIcd10Code").val('');
            $("#txtDxCategory").val('');
            $("#txtDxDate").val('');
            $("#txtDxResolvedDate").val('');
            break;
        case 2: // Procedures
            $("#txtProcDate").datepicker();
            $("#txtProcNameSearch").val('');
            $("#txtProcResults").val('');
            $("#txtProcDate").val('');
            break;
        case 3: // Laboratory Tests
            $("#txtOrderDate").datepicker();
            $("#txtOrderDate").val('');
            $("#txtLabName").val('');
            $("#txtResult").val('');
            $("#txtUnits").val('');
            $("#txtLow").val('');
            $("#txtHigh").val('');
            $("#ddlFlag").val('');
            break;
        case 5: // Encounters
            $("#txtEncounterDate").datepicker();
            $("#txtEncounterDate").val('');
            $("#ddlEncounterType").val('');
            $("#txtEncounterReason").val('');
            $("#txtEncounterNotes").val('');
            break;
        case 6: // Allergies
            $("#txtAllergyDate").val('');
            $("#txtAllergyDate").datepicker();
            $("#txtAllergyDescription").val('');
            $("#txtAdverseReaction").val('');
            $("#ddlSeverity").val('');
            break;
        case 7: // Social history
            $("#txtSocialNoteDate").datepicker();
            // initRTE("txtSocialNoteText");
            $("#txtSocialNoteDate").val('');
            break;
        case 8: // Notes
            $("#txtNoteDate").datepicker();
            initRTE("txtNoteText");
            $("#txtNoteDate").val('');
            tinymce.get('txtNoteText').setContent('');
            break;
        case 9: // Patient demographics
            initRTE("txtDemographicValue", 200);
            $("#txtDemographicLabel").val('');
            tinymce.get('txtDemographicValue').setContent('');
            $("#txtDemographicValue").val('');
            break;
        case 10: // Radiology
            $("#txtRadiologyNoteDate").datepicker();
            initRTE("txtRadiologyNoteText");
            $("#txtRadiologyNoteDate").val('');
            $("#txtRadiologyTestName").val('');
            $("#txtRadiologyNoteText").val('');
            tinymce.get('txtRadiologyNoteText').setContent('');
            break;
        case 0: // Other
            $("#txtOtherNoteDate").datepicker();
            initRTE("txtOtherNoteText");
            $("#txtOtherNoteDate").val('');
            tinymce.get('txtOtherNoteText').setContent('');
            break;
        case 11: // Vitals
            $("#txtVisitDate").datepicker();
            $("#txtVisitDate").val('');
            $("#txtVitalName").val('');
            $("#txtVitalValue").val('');

            break;

    }

    addBnNodeTypeSelector("");
    // Open model popup
    $('#playerCategoryItemEditor' + currentCategory.id).dialog({ "title": "Add New " + currentCategory.name + " Item" });
    $('#playerCategoryItemEditor' + currentCategory.id).dialog("open");
}


/**************************************************************************************************************************************
Function:       initRTE
Description:    Initialize TinyMCE RTE
Argument(s):    editorID - DOM ID of the <textarea> associated with RTE editor
Return:         N/A
**************************************************************************************************************************************/
function initRTE(editorID, editorHeight) {
    editorHeight = editorHeight || 400;
    tinymce.init({
        selector: '#' + editorID,
        height: editorHeight,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table contextmenu paste code'
        ],
        toolbar: ' styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link imageuploader | table  ',
        setup: function (editor) {

            function insertImage() {
                $('#frmImageUploader').dialog("open");

            }

            editor.addButton('imageuploader', {
                icon: 'image',
                tooltip: "Insert Image",
                onclick: insertImage
            });
        }

    });

    initImageUploader();
}


/**************************************************************************************************************************************
Function:       searchDrugs
Description:    Search drug list
Argument(s):    searchField - DOM textfield <input> object
Return:         N/A
**************************************************************************************************************************************/
function searchDrugs(searchField) {
    $obj = $(searchField);

    if ($obj) {
        if ($obj.val().length == 2) { // Only start search after the user types at least two characters
            // This needs to be optimized or cached
            $.getJSON("/Rest/GetDrugs?searchTerm=" + $obj.val(), function (data) {
                drugs = {};
                data = JSON.parse(data);
                // Linear search through the entire drug list - REFACTOR!!!
                for (var i = 0; i < data.length; i++) {
                    drugs[data[i].TradeName + ' (' + data[i].Ingredient + ')'] = data[i];
                }
                // Leverage jQueryUI autocomplete feature
                $(searchField).autocomplete({
                    source: Object.keys(drugs)
                });

                // When user moves off the search field, auto-fill all the EDIT fields
                $(searchField).on("blur", function () {
                    var selDrug = $(this).val();
                    var selDrugObj = drugs[selDrug];
                    $("#txtDrugName").val(selDrugObj.TradeName);
                    $("#txtIngridient").val(selDrugObj.Ingredient);
                    $("#txtDosageForm").val(selDrugObj.DosageForm);
                    $("#txtRouteOfAdmin").val(selDrugObj.RouteOfAdministration);
                    $("#txtDrugStrength").val(selDrugObj.Strength);
                });
            });
        }
    }
}

/**************************************************************************************************************************************
Function:       searchDx
Description:    Search diagnosis list (with associated ICD-10 codes)
Argument(s):    searchField - DOM textfield <input> object
Return:         N/A
**************************************************************************************************************************************/
function searchDx(searchField) {
    $obj = $(searchField);
    if ($obj) {
        if ($obj.val().length == 2) {
            $.getJSON("/Rest/GetDiagnoses?searchTerm=" + $obj.val(), function (data) {
                dx = {};
                data = JSON.parse(data);

                // Linear search through the entire drug list - REFACTOR!!!
                for (var i = 0; i < data.length; i++) {
                    dx[data[i].DiagnosisName + ' (' + data[i].ICD10Code + ')'] = data[i];
                }

                // Leverage jQueryUI autocomplete feature
                $(searchField).autocomplete({
                    source: Object.keys(dx)
                });

                // When user moves off the search field, auto-fill all the EDIT fields
                $(searchField).on("blur", function () {
                    var selDx = $(this).val();
                    var selDxObj = dx[selDx];
                    console.log(selDxObj);
                    $("#txtDxName").val(selDxObj.DiagnosisName);
                    $("#txtDxIcd10Code").val(selDxObj.ICD10Code);
                    $("#txtDxCategory").val(selDxObj.CategoryName);
                });
            });
        }
    }
}


/**************************************************************************************************************************************
Function:       searchProcs
Description:    Search diagnosis list (with associated ICD-10 codes)
Argument(s):    searchField - DOM textfield <input> object
Return:         N/A
**************************************************************************************************************************************/
function searchProcs(searchField) {
    $obj = $(searchField);
    if ($obj) {
        if ($obj.val().length == 2) {
            $.getJSON("/Rest/GetProcedures?searchTerm=" + $obj.val(), function (data) {
                dx = {};
                data = JSON.parse(data);
                // Linear search through the entire drug list - REFACTOR!!!
                for (var i = 0; i < data.length; i++) {
                    dx[data[i].LongName] = data[i];
                }

                // Leverage jQueryUI autocomplete feature
                $(searchField).autocomplete({
                    source: Object.keys(dx)
                });
            });
        }
    }
}



/**************************************************************************************************************************************
Function:       saveCaseContentItem
Description:    Saves a single case content item to "casecontent" collection in MongoDB
Argument(s):    contentObj - single case content object
Return:         N/A
**************************************************************************************************************************************/
function saveCaseContentItem(contentObj) {
    var editContentItemID = $("#currentContentItemID").val(); // Unique ID for the content object that's currently being edited
    var postUrl, postData;
    var rowID; // unique identifier for HTML table row
    if (contentObj) {
        contentObj.CaseID = caseID; // Each content object must be associated with a caseID
        contentObj.NodeAutoID = $("#currentNetworkNodeAutoID").val(); // if object is associated with a BN node, set this property
        contentObj.NodeID = $("#currentNetworkNodeID").val(); // if object is associated with a BN node, set this property
        contentObj.CategoryID = currentCategory.id; // Each content object must be associated with a categoryID (e.g. diagnosis)

        /**** MAY NEED TO ADD ERROR HANDLING TO NEXT LINE ****/
        if($("#bnNodeStateSelector").length){
            contentObj.DefaultBnState = $("#bnNodeStateSelector").val();
        }
        else {
            contentObj.DefaultBnState = "";
        }

        if ($("#bnNodeTypeSelector").length) {
            contentObj.NodeType = $("#bnNodeTypeSelector").val();
        }
        else {
            contentObj.NodeType = "";
        }

        

        if (editContentItemID != "") {
            // Update item
            contentObj.ContentItemID = editContentItemID;
            postUrl = "/Rest/UpdateCaseContentItem";
            postData = {
                "contentItemID": contentObj.ContentItemID,
                "caseContentJson": JSON.stringify(contentObj)
            };
        }
        else {
            // Create item
            contentObj.ContentItemID = generateUUID();
            postUrl = "/Rest/CreateCaseContentItem";
            postData = { "caseContentJson": JSON.stringify(contentObj) };
        }

        // Save data
        $.post(postUrl, postData, function (response) {
            // error handling later
            // console.log(caseContentData); /* DEBUG */
            if (editContentItemID != "") {
                // Update an item with the same content item ID
                // NOTE: change caseContentData to a dictionary or create a hash
                // to improve performance
                for (var i = 0; i < caseContentData.length; i++) {
                    if (caseContentData[i].ContentItemID == editContentItemID) {
                        caseContentData[i] = contentObj;
                    }
                }
            }
            else {
                caseContentData.push(contentObj); // Add new item to the list
            }
            
            // console.log(caseContentData); /* DEBUG */

            // Add new data as a row to a corresponding table.
            // function loadContentItemRow is in player.js
            var tbl = $('#tblCategory' + currentCategory.id);
            var div = $('#divCategory' + currentCategory.id);
            var cols = categoryColumns["category" + currentCategory.id];
            $("#tr_" + contentObj.NodeAutoID).remove();
            $("#tr_" + contentObj.ContentItemID).remove();
            loadContentItemRow(contentObj, tbl, div, cols);
        });

        // Reset category and network IDs
        $("#currentContentItemID").val("");
        $("#currentNetworkNodeID").val("");
        $("#currentNetworkNodeAutoID").val("");
        $('#playerCategoryItemEditor' + currentCategory.id).dialog("close");
    }
}


/**************************************************************************************************************************************
The following section of code creates individial case content objects and passes them to saveCaseContentItem function
**************************************************************************************************************************************/
function saveDrugData() {
    var contentObj = {};
    contentObj.Label = $("#txtDrugName").val();
    contentObj.TradeName = $("#txtDrugName").val();
    contentObj.Ingredient = $("#txtIngridient").val();
    contentObj.DosageForm = $("#txtDosageForm").val();
    contentObj.RouteOfAdministration = $("#txtRouteOfAdmin").val();
    contentObj.Strength = $("#txtDrugStrength").val();
    contentObj.Frequency = $("#txtDrugFrequency").val();
    contentObj.StartDate = $("#txtDrugStartDate").val();
    contentObj.StopDate = $("#txtDrugStopDate").val();
    contentObj.IsPriorHistory = $("#ddlIncludeDrugPriorHistory").val();
    contentObj.TemporalTier = $("#txtDrugTemporalTier").val();
    contentObj.Group = $("#txtDrugGroup").val();
    saveCaseContentItem(contentObj);
}


function saveDxData() {
    var contentObj = {};
    contentObj.Label = $("#txtDxName").val();
    contentObj.DiagnosisName = $("#txtDxName").val();
    contentObj.ICD10Code = $("#txtDxIcd10Code").val();
    contentObj.CategoryName = $("#txtDxCategory").val();
    contentObj.DiagnosisDate = $("#txtDxDate").val();
    contentObj.DiagnosisResolvedDate = $("#txtDxResolvedDate").val();
    contentObj.IsPriorHistory = $("#ddlIncludeDxPriorHistory").val();

    saveCaseContentItem(contentObj);
}


function saveProcData() {
    var contentObj = {};
    contentObj.Label = $("#txtProcNameSearch").val();
    contentObj.ProcedureName = $("#txtProcNameSearch").val();
    contentObj.ProcedureDate = $("#txtProcDate").val();
    contentObj.ProcedureResults = $("#txtProcResults").val();
    contentObj.IsPriorHistory = $("#ddlIncludeProcedurePriorHistory").val();
    contentObj.TemporalTier = $("#txtProcTemporalTier").val();
    contentObj.Group = $("#txtProcGroup").val();
    saveCaseContentItem(contentObj);
}

function saveVitalsData() {
    var contentObj = {};
    contentObj.Label = $("#txtVitalName").val() + ": " + $("#txtVitalValue").val();
    contentObj.VisitDate = $("#txtVisitDate").val();
    contentObj.VitalName = $("#txtVitalName").val();
    contentObj.VitalValue = $("#txtVitalValue").val();
    contentObj.IsPriorHistory = $("#ddlIncludeVitalsPriorHistory").val();
    contentObj.TemporalTier = $("#txtVitalTemporalTier").val();
    contentObj.Group = "";
    saveCaseContentItem(contentObj);
}

function saveNoteData() {
    var contentObj = {};
    contentObj.Label = "Note";
    contentObj.NoteDate = $("#txtNoteDate").val();
    contentObj.NoteText = encodeURI(tinymce.get('txtNoteText').getContent()); // $("#txtNoteText").val();
    contentObj.IsPriorHistory = "Yes";
    contentObj.TemporalTier = $("#txtNoteTemporalTier").val();
    contentObj.Group = "";
    saveCaseContentItem(contentObj);
}

function saveRadiologyNoteData() {
    var contentObj = {};
    contentObj.Label = "Radiology Note";
    contentObj.NoteDate = $("#txtRadiologyNoteDate").val();
    contentObj.RadiologyTestName = $("#txtRadiologyTestName").val();
    contentObj.NoteText = encodeURI(tinymce.get('txtRadiologyNoteText').getContent()); // $("#txtNoteText").val();
    contentObj.IsPriorHistory = $("#ddlIncludeRadiologyPriorHistory").val();
    contentObj.TemporalTier = $("#txtRadiologyTemporalTier").val();
    contentObj.Group = $("#txtRadiologyGroup").val();
    saveCaseContentItem(contentObj);
}

function saveOtherNoteData() {
    var contentObj = {};
    contentObj.Label = "Other Note";
    contentObj.NoteDate = $("#txtOtherNoteDate").val();
    contentObj.NoteText = encodeURI(tinymce.get('txtOtherNoteText').getContent()); // $("#txtNoteText").val();
    contentObj.IsPriorHistory = $("#ddlIncludeOtherPriorHistory").val();
    contentObj.OutcomeLabel = $("#txtOtherOutcomeLabel").val();
    contentObj.TemporalTier = $("#txtOtherNoteTemporalTier").val();
    contentObj.NodeType = 2;
    contentObj.Group = "";
    saveCaseContentItem(contentObj);
}

function saveSocialNoteData() {
    var contentObj = {};
    contentObj.Label = encodeURI($("#txtSocialNoteText").val());
    contentObj.NoteDate = $("#txtSocialNoteDate").val();
    contentObj.NoteText = encodeURI($("#txtSocialNoteText").val());
    contentObj.IsPriorHistory = "Yes";
    contentObj.TemporalTier = $("#txtSocialTemporalTier").val();
    contentObj.Group = "";
    //encodeURI(tinymce.get('txtSocialNoteText').getContent()); // $("#txtNoteText").val();
    saveCaseContentItem(contentObj);
}

function saveAllergyData() {
    var contentObj = {};
    contentObj.Label = encodeURI($("#txtAllergyDescription").val());
    contentObj.AllergyDate = $("#txtAllergyDate").val();
    contentObj.AllergyDescription = encodeURI($("#txtAllergyDescription").val());
    contentObj.AdverseReaction = encodeURI($("#txtAdverseReaction").val());
    contentObj.Severity = $("#ddlSeverity").val();
    contentObj.IsPriorHistory = $("#ddlIncludeAllergyPriorHistory").val();
    contentObj.TemporalTier = $("#txtAllergyTemporalTier").val();
    contentObj.Group = $("#txtAllergyGroup").val();
    saveCaseContentItem(contentObj);
}

function saveEncounterData() {
    var contentObj = {};
    contentObj.Label = $("#ddlEncounterType").val();
    contentObj.EncounterDate = $("#txtEncounterDate").val();
    contentObj.EncounterType = $("#ddlEncounterType").val();
    contentObj.EncounterReason = encodeURI($("#txtEncounterReason").val());
    contentObj.EncounterNotes = encodeURI($("#txtEncounterNotes").val());
    contentObj.IsPriorHistory = "Yes";
    saveCaseContentItem(contentObj);
}

function saveDemographicData() {
    var contentObj = {};
    contentObj.Label = $("#txtDemographicLabel").val();
    contentObj.DemographicLabel = $("#txtDemographicLabel").val();
    contentObj.DemographicValue = encodeURI(tinymce.get('txtDemographicValue').getContent()); // $("#txtDemographicValue").val();
    contentObj.TemporalTier = $("#txtDemographicTemporalTier").val();
    contentObj.Group = "";
    contentObj.IsPriorHistory = "Yes";
    saveCaseContentItem(contentObj);

}

function saveLabData() {
    var contentObj = {};
    contentObj.Label = $("#txtLabName").val() + ": " + $("#txtResult").val();
    contentObj.OrderDate = $("#txtOrderDate").val();
    contentObj.LabName = $("#txtLabName").val();
    contentObj.Result = $("#txtResult").val();
    contentObj.Units = $("#txtUnits").val();
    contentObj.Low = $("#txtLow").val();
    contentObj.High = $("#txtHigh").val();
    contentObj.Flag = $("#ddlFlag").val();
    contentObj.IsPriorHistory = $("#ddlIncludeLabsPriorHistory").val();
    contentObj.TemporalTier = $("#txtLabsTemporalTier").val();
    contentObj.Group = $("#txtLabsGroup").val();
    saveCaseContentItem(contentObj);
}

/**************************************************************************************************************************************
End save data section
**************************************************************************************************************************************/


function initImageUploader() {
    $('#imageFile').on('change', function (e) {
        var files = e.target.files;
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                var data = new FormData();
                for (var x = 0; x < files.length; x++) {
                    data.append("file" + x, files[x]);
                }

                $.ajax({
                    type: "POST",
                    url: '/Rest/UploadMediaFile?caseID=' + caseID,
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (result) {
                        ///console.log(result);

                        $('#frmImageUploader').dialog("close");
                        var imgTag = "<img src='" + result.filePath.replace("~", "..") + "' />";
                        tinymce.activeEditor.execCommand('mceInsertContent', false, imgTag);
                    },
                    error: function (err) {

                        alert(err);
                    }
                });
            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }
    });
}