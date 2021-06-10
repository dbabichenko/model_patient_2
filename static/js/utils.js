function jsonToTable(tableID, columnHeaders, data) {
    $tbl = $('#' + tableID);
    var url = "";
    if ($tbl) {
        // Build header
        if (columnHeaders) {
            $tr = $("<tr></tr>");
            for (var i = 0; i < columnHeaders.length; i++) {
                $td = $("<td></td>");
                $td.attr("class", "listTableCellHeader");
                $td.html(columnHeaders[i].label);
                $tr.append($td);
            }
            $tbl.append($tr);
        }
        for (var i = 0; i < data.length; i++) {
            $tr = $("<tr></tr>");
            for (var j = 0; j < columnHeaders.length; j++) {
                $td = $("<td></td>");
                var contents = "";
                if (columnHeaders[j].display == "text") {
                    contents = data[i][columnHeaders[j].field];
                }
                else if (columnHeaders[j].display == "link") {
                    if (columnHeaders[j].url == "")
                        url = data[i][columnHeaders[j].field];
                    else
                        url = columnHeaders[j].url + columnHeaders[j].query + data[i][columnHeaders[j].field];

                    contents = "<a href='" + url + "' target='" + columnHeaders[j].target + "'>" + columnHeaders[j].label + "</a>";

                }
                else if (columnHeaders[j].display == "imagelink") {
                    $td.css("text-align", "center");
                    if (columnHeaders[j].target == "")
                        url = data[i][columnHeaders[j].field];
                    else
                        url = columnHeaders[j].url + columnHeaders[j].query + data[i][columnHeaders[j].field];

                    contents = "<a href='" + url + "' target='" + columnHeaders[j].target + "'><img src='/Images/Icons/" + columnHeaders[j].image + "' class='linkicon' alt='" + columnHeaders[j].label + "' title='" + columnHeaders[j].label + "'></a>";
                }
                else {
                    contents = "";
                }
                $td.html(contents);
                $tr.append($td);
            }
            $tbl.append($tr);
        }


    }
}