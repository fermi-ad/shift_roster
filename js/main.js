/*jshint esversion: 6 */
/*globals $:false */
/*globals X2JS */
/*globals console */
var x2js = new X2JS(),
    now = new Date(),
    startDateString = new Date(now.getTime()).toString("MM/dd/yyyy"),
    endDate = new Date();

endDate.setTime(now.getTime() + (1*60*60*1000));

    var endDateString = new Date(endDate.getTime());

endDateString = endDateString.toString('MM/dd/yyyy');

function getBosHTML() {
    $.ajax({
        type:       "POST",
        url:        "https://www-bd.fnal.gov/BossOSchedule/schedule",
        cache:      false,
        data:       `action=get_schedule&format=XML&start_date=${startDateString}&end_date=${endDateString}`,
        dataType:   "XML"
    })
        .done(xml => console.log("Success: ",x2js.xml2json(xml)))
        .fail((jqXHR, textStatus, errorText) => console.log("Error: ",jqXHR," ",textStatus," ",errorText))
        .always(console.log(`startDate: ${startDateString} & endDate: ${endDateString}`));
}

/*function parseForEntryID(htmlStr) {
    var el = $('<div></div>');
    el.html(htmlStr);

    return $('.id a', el).text(); // All the class="id" elements
}

function rosterPost(id, array) {
    var entryArray = [],
        formData = new FormData();

    entryArray.push('<u><strong>'+array[0]+'</strong></u>');
    entryArray.push('<ul>');
    entryArray.push('<li>'+array[1]+' <strong>CC</strong></li>');

    for (var i = 2; i < array.length; i++) {
        entryArray.push('<li>'+array[i]+'</li>');
    }

    entryArray.push('</ul>');

    var entryText = entryArray.join('');

    formData.append('entryID', id);
    formData.append('text', entryText);

    $.ajax({
            url: 'https://www-bd.fnal.gov/Elog/addComment',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
        })
        .done(function() {
            console.log("POST success");
        })
        .fail(function() {
            console.log("POST error");
        })
        .always(function() {
            console.log("POST complete");
        });

}

function makePost(array) {
    $.when(
            $.ajax('https://www-bd.fnal.gov/Elog/?categoryNames=Shift+Change&limit=1'))
        .done(function(html) {
            var entryID = parseForEntryID(html);
            rosterPost(entryID, array);
        });
}

function opsList() {
    return getBosRoster().then(function(html) {
        var cellId = cellNumber(),
            $cell = $(html).find('td:eq(' + cellId[0] + ')'),
            opsArray = [];

        for (var i = 0; i < 10; i++) {
            var operator = $cell.find('div:eq(' + i + ')').attr('title'),
                cc = $cell.find('div:eq(' + i + ')').find('span').attr('class');

            if (typeof operator == "string") {
                var opArray = operator.split(' ');

                if (opArray[0] == "KelliAnn") {
                    opArray[0] = "Kelli";
                }

                if (cc == "crew_chief") {
                    opsArray.unshift(opArray[0] + ' ' + opArray[1]);
                } else {
                    opsArray.push(opArray[0] + ' ' + opArray[1]);
                }
            } else {
                break;
            }
        }

        opsArray.unshift(cellId[1]);

        return opsArray;
    });
}

function getBosRoster() {
    return $.when($.ajax('https://www-bd.fnal.gov/BossOSchedule/schedule.jsp'))
        .done(function(html) {
            return html;
        });
}

function cellNumber() {
    var now = new Date(),
        hour = now.getHours(),
        day = now.getDay(),
        row,
        cell = [];

    var days = [weekend, weekday, weekday, weekday, weekday, weekday, weekend];

    cell[0] = days[day]();
    cell[1] = shiftTitle(cell[0]);

    function weekday() {
        if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(hour) > -1) {
            row = 0;
        } else if ([8, 9, 10, 11, 12, 13, 14, 15].indexOf(hour) > -1) {
            row = 1;
        } else if ([16, 17, 18, 19, 20, 21, 22, 23].indexOf(hour) > -1) {
            row = 2;
        } else {
            alert("Oh Noes! Something went wrong!");
            console.log("Weekday didn't match any hour...");
        }

        return row * 7 + day;
    }

    function weekend() {
        var nextDay = 0;

        if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(hour) > -1) {
            row = 0;
        } else if ([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(hour) > -1) {
            row = 1;
        } else if ([20, 21, 22, 23].indexOf(hour) > -1) {
            row = 0;
            nextDay = 1;
        } else {
            alert("Oh Noes! Something went wrong!");
            console.log("Weekend didn't match any hour...");
        }

        return row * 7 + day + nextDay;
    }

    function shiftTitle(cell) {
        if (cell == 1 || cell == 7) {
            return "Owl+ Shift Roster";
        } else if (1 < cell && cell < 7) {
            return "Owl Shift Roster";
        } else if (7 < cell && cell < 13) {
            return "Day Shift Roster";
        } else if (12 < cell && cell < 15) {
            return "Day+ Shift Roster";
        } else if (14 < cell && cell < 19) {
            return "Evening Shift Roster";
        }

        if (0 < cell && cell < 6) {
            return "Owl Shift Roster";
        } else if (5 < cell && cell < 8) {
            return "Owl+ Shift Roster";
        } else if (7 < cell && cell < 13) {
            return "Day Shift Roster";
        } else if (12 < cell && cell < 15) {
            return "Day+ Shift Roster";
        } else if (14 < cell && cell < 19) {
            return "Evening Shift Roster";
        }
    }

    return cell;
}*/