/**************************************************************************************************************************************
Each BN node can be categorized into one of the following categories.  Node colors depend on each node's category. 
These categories are used across the entire application, including the VP player
**************************************************************************************************************************************/
var eventCategories = [
    { "id": 6, "name": "Allergies", "color": "e31a1c" },
    { "id": 9, "name": "Demographic", "color": "cab2d6" },
    { "id": 1, "name": "Diagnoses", "color": "a6cee3" },
    { "id": 4, "name": "Drugs", "color": "33a02c" },
    { "id": 5, "name": "Encounters", "color": "fb9a99" },
    { "id": 3, "name": "Laboratory Tests", "color": "b2df8a" },
    { "id": 8, "name": "Notes", "color": "ff7f00" },
    { "id": 2, "name": "Procedures", "color": "1f78b4" },
    { "id": 10, "name": "Radiology", "color": "6a3d9a" },
    { "id": 7, "name": "Social History", "color": "fdbf6f" },
    { "id": 11, "name": "Vitals", "color": "b15928" },
    { "id": 0, "name": "Outcome", "color": "ffffff" } 
];


/**************************************************************************************************************************************
Each category has certain columns associated with is.  This variable is used to populate view tables in player editor 
and in vp player.  
*** Later it it worth looking into drawing the entire HTMl table from this structure ***
**************************************************************************************************************************************/
var categoryColumns = {
    "category0": ["NoteDate", "NoteText", "DefaultBnState", "OutcomeLabel", "IsPriorHistory", "TemporalTier"],
    "category1": ["DiagnosisName", "ICD10Code", "CategoryName", "DiagnosisDate", "DiagnosisResolvedDate", "DefaultBnState", "IsPriorHistory", "TemporalTier", "Group"],
    "category2": ["ProcedureName", "ProcedureDate", "ProcedureResults", "DefaultBnState", "IsPriorHistory", "TemporalTier", "Group"],
    "category3": ["OrderDate", "LabName", "Result", "Units", "Low", "High", "Flag", "DefaultBnState", "IsPriorHistory", "TemporalTier", "Group"],
    "category4": ["TradeName", "Ingredient", "DosageForm", "RouteOfAdministration", "Strength", "Frequency", "StartDate", "StopDate", "DefaultBnState", "IsPriorHistory", "TemporalTier", "Group"],
    "category5": ["EncounterDate", "EncounterType", "EncounterReason", "EncounterNotes", "DefaultBnState", "TemporalTier"],
    "category6": ["AllergyDate", "AllergyDescription", "AdverseReaction", "Severity", "DefaultBnState", "IsPriorHistory", "TemporalTier", "Group"],
    "category7": ["NoteDate", "NoteText", "TemporalTier"],
    "category8": ["NoteDate", "NoteText", "DefaultBnState", "IsPriorHistory", "TemporalTier"],
    "category9": ["DemographicLabel", "DemographicValue", "TemporalTier"],
    "category10": ["NoteDate", "RadiologyTestName", "NoteText", "DefaultBnState", "IsPriorHistory", "TemporalTier", "Group"],
    "category11": ["VisitDate", "VitalName", "VitalValue", "DefaultBnState", "IsPriorHistory", "TemporalTier"]
};

var categoryDateFields = {
    "category0": "NoteDate",
    "category1": "DiagnosisDate",
    "category2": "ProcedureDate", 
    "category3": "OrderDate",
    "category4": "StartDate", 
    "category5": "EncounterDate", 
    "category6": "AllergyDate", 
    "category7": "NoteDate",
    "category8": "NoteDate", 
    "category10": "NoteDate",
    "category11": "VisitDate"
}
/**************************************************************************************************************************************
Default metrics for each VP case.
**************************************************************************************************************************************/
var defaultMetrics = ["Patient Health", "Score", "Virtual Time"];


/**************************************************************************************************************************************
Comparison operators used in RuleBuilder
**************************************************************************************************************************************/
var comparisonOperators = [
    { "value": "=", "text": "equals to" },
    { "value": "<", "text": "less than" },
    { "value": ">", "text": "greater than" },
    { "value": "between", "text": "between" },
    { "value": "!=", "text": "not equal to" }
];
       

/**************************************************************************************************************************************
Assignment operators used in RuleBuilder
**************************************************************************************************************************************/
var assignmentOperators = [
    { "value": "-", "text": "decreases by" },
    { "value": "+", "text": "increases by" },
    { "value": "=", "text": "equals to" }
];
    

/**************************************************************************************************************************************
Sequence for editing a VP case. Navigation in vp case editor wizard is drawn from this structure
**************************************************************************************************************************************/
var navSequence = [
    { "url" : "EditCase", "label": "Edit Details", "target": "_self"},
    { "url": "CaseIntro", "label": "Edit Introduction", "target": "_self" },
    { "url": "PlayerEditor", "label": "Edit EMR Content", "target": "_self" },
    { "url": "DistractorsFromData", "label": "Load Distractors from Data", "target": "_self" },
    { "url": "CaseMetrics", "label": "Edit Metrics", "target": "_self" },
    { "url": "RuleBuilder", "label": "Edit Rules", "target": "_self" },
    { "url": "../Player/Player", "label": "Preview", "target": "_blank" }
]

function createPlayerEditorNavLinks(caseID, networkID) {
    console.log("HERE");
    for (var i = 0; i < navSequence.length; i++) {
        $lnk = $("<a>" + navSequence[i].label + "</a>");
        $lnk.attr({
            "href": navSequence[i].url + "?caseID=" + caseID + "&networkID=" + networkID,
            "target": navSequence[i].target
        });
        $navMenuItem = $("<li></li>");
        $navMenuItem.append($lnk);
        $("#navLinksPlaceholder").append($navMenuItem);
    }
}

/**************************************************************************************************************************************
Function:       generateUUID
Description:    Generates a unique identifier similar to Python's uuid() and MySQL's UUID()
Argument(s):    n/a
Return:         n/a
**************************************************************************************************************************************/
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};


/**************************************************************************************************************************************
Function:       renderCaseEditorNavButtons
Description:    Renders next and previous buttons for VP case editor wizard based on the sequence of 
                values in navSequence variable in global.js
Argument(s):    sequenceIndex   -   index of the current page in navSequence 
                caseID          -   unique identifier of the current case
                networkID       -   unique identifier of the current BN model
Return:         n/a
**************************************************************************************************************************************/
function renderCaseEditorNavButtons(sequenceIndex, caseID, networkID) {
    if (sequenceIndex > 0) {
        // render "Previous" button
        $btnPrev = $("<input />");
        $btnPrev.attr({
            "type": "button", "class": "nav-button", "value": navSequence[sequenceIndex - 1].label
        });
        $btnPrev.click(function () {
            document.location.href = navSequence[sequenceIndex - 1].url + "?caseID=" + caseID + "&networkID=" + networkID;
        });

        $(".authoring-nav-buttons").append($btnPrev);
    }

    if (sequenceIndex < (navSequence.length - 1)) {
        // Render "Next" button
        $btnNext = $("<input />");
        $btnNext.attr({
            "type": "button", "class": "nav-button", "value": navSequence[sequenceIndex + 1].label
        });
        $btnNext.click(function () {
            document.location.href = navSequence[sequenceIndex + 1].url + "?caseID=" + caseID + "&networkID=" + networkID;
        });

        $(".authoring-nav-buttons").append($btnNext);
    }
}

/**************************************************************************************************************************************
Function:       getUrlParameterByName
Description:    Gets URL query parameter from name/value pairs passed on URL. 
Argument(s):    name    -   name of the URL parameter
                url     -   complete URL
Return:         value of specified parameter
**************************************************************************************************************************************/
function getUrlParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCurrentDateTimeMySqlFormat() {
    var today = new Date();
    var curDateTime = (today.getFullYear() + '-' + today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return curDateTime;
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
    
}



var nodeTypes = {
    "Decision": 1,
    "Outcome": 2,
    "Initial": 3
}

// From https://stackoverflow.com/questions/4587061/how-to-determine-if-object-is-in-array
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

function roundNumber(num) {
    return Math.round(num * 100) / 100;
}

var colorList = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'];


var sortSelect = function (select, attr, order) {
    if (attr === 'text') {
        if (order === 'asc') {
            $(select).html($(select).children('option').sort(function (x, y) {
                return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
            }));
            $(select).get(0).selectedIndex = 0;
            // e.preventDefault();
        }// end asc
        if (order === 'desc') {
            $(select).html($(select).children('option').sort(function (y, x) {
                return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
            }));
            $(select).get(0).selectedIndex = 0;
            // e.preventDefault();
        }// end desc
    }

};
