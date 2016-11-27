/*jshint esversion: 6 */
/*globals $:false */
/*globals X2JS */
/*globals console */
var x2js            = new X2JS(), // Check out /docs/README_xml2json.md
    now             = new Date(), // A string can be inserted to specify date, for testing ie. "2016-05-29T21:00:00"
    startDateString = new Date(now.getTime()).toString("MM/dd/yyyy"),
    endDate         = new Date();

const   workingStatus   = ["working", "shift coverage"], // BOS API "working" statuses
        actualNames     = ["KelliAnn"], // Elog default names
        desiredNames    = ["Kelli"]; // Desired name replacements

endDate.setTime(now.getTime() + (1*60*60*1000));

var endDateString = new Date(endDate.getTime()).toString('MM/dd/yyyy');

function opsList() {
    return getBosRoster().then(function(xmlRoster) {
        let roster      = x2js.xml2json(xmlRoster),
            opsArray    = [],
            shift       = shiftInfo(now), // returns {title, type} based on date object
            operators   = [],
            shifts      = roster.schedule.day.shift;

        for (let i = 0; i < shifts.length; i++) {
            if (shifts[i].type == shift.type) { // shift.type can be replaced with "Owl", "Day", or "Evening" to select the shift in the day
                operators = shifts[i].operator;
            }
        }

        for (let i = 0; i < operators.length; i++) {
            if (operators[i].is_chief == "true" && workingStatus.includes(operators[i].working_status)) {
                opsArray.unshift(opsNames(operators[i])); // Put CC at beginning of array
            } else if (workingStatus.includes(operators[i].working_status)) {
                opsArray.push(opsNames(operators[i])); // Append each operator
            }
        }

        function opsNames(operator) { // Concatonate names and cross verify with desiredNames array for name changes
            if (actualNames.includes(operator.first_name)) {
                operatorName = desiredNames[actualNames.indexOf(operator.first_name)] + " " + operator.last_name;
            } else {
                operatorName = operator.first_name + " " + operator.last_name;
            }

            return operatorName;
        }

        opsArray.unshift(shift.title); // Put title at the beginning of the array

        return opsArray; // [shift.title, cc, op1, op2, op3, op4...]
    });
}

function getBosRoster() { // POST request to BOS for today's shifts
    dateAdjust();

    return $.ajax({
        type:       "POST",
        url:        "https://www-bd.fnal.gov/BossOSchedule/schedule",
        cache:      false,
        data:       `action=get_schedule&format=XML&start_date=${startDateString}&end_date=${startDateString}`,
        dataType:   "XML"
    })
        .done(function(xml) {
            console.log(x2js.xml2json(xml));
        })
        .fail((jqXHR, textStatus, errorText) => console.log("Error: ",jqXHR," ",textStatus," ",errorText));
}

function dateAdjust() {
    let dateAdjustNow = new Date();

    if (now.getHours() > 7 && (now.getDay() === 0 || now.getDay() === 6)) { // getHours returns 0-23 // getDay returns 0-6 Sun-Sat
        // set start and end date strings to midnight of the next day
        dateAdjustNow.setDate(now.getDate()+1); // Next day
        dateAdjustNow.setHours(0); // Midnight
        startDateString = new Date(dateAdjustNow.getTime()).toString("MM/dd/yyyy");
        endDate.setTime(dateAdjustNow.getTime() + (1*60*60*1000));
        endDateString = new Date(dateAdjustNow.getTime()).toString("MM/dd/yyyy");
    }

    return false; // no date adjust needed
}

function shiftInfo(now) {
    let hour        = now.getHours(),
        day         = now.getDay(),
        row,
        cell,
        shiftInfo   = {title:"",type:""};

    const days = [weekend, weekday, weekday, weekday, weekday, weekday, weekend];

    cell = days[day]();
    shiftTitle(cell);

    function weekday() {
        if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(hour) > -1) {
            row = 0; // Owl
        } else if ([8, 9, 10, 11, 12, 13, 14, 15].indexOf(hour) > -1) {
            row = 1; // Day
        } else if ([16, 17, 18, 19, 20, 21, 22, 23].indexOf(hour) > -1) {
            row = 2; // Evening
        } else {
            alert("Oh Noes! Something went wrong!");
            console.log("Weekday didn't match any hour...");
        }

        return row * 7 + day;
    }

    function weekend() {
        let nextDay = 0;

        if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(hour) > -1) {
            row = 0; // Owl
        } else if ([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(hour) > -1) {
            row = 1; // Day+
        } else if ([20, 21, 22, 23].indexOf(hour) > -1) {
            row = 0; // Owl+
            nextDay = 1;
        } else {
            alert("Oh Noes! Something went wrong!");
            console.log("Weekend didn't match any hour...");
        }

        return row * 7 + day + nextDay;
    }

    function shiftTitle(cell) {
        if (cell == 1 || cell == 7) {
            shiftInfo.title = "Owl+ Shift Roster";
            shiftInfo.type  = "Owl";
            return true;
        } else if (1 < cell && cell < 7) {
            shiftInfo.title = "Owl Shift Roster";
            shiftInfo.type  = "Owl";
            return true;
        } else if (7 < cell && cell < 13) {
            shiftInfo.title = "Day Shift Roster";
            shiftInfo.type  = "Day";
            return true;
        } else if (12 < cell && cell < 15) {
            shiftInfo.title = "Day+ Shift Roster";
            shiftInfo.type  = "Day";
            return true;
        } else if (14 < cell && cell < 19) {
            shiftInfo.title = "Evening Shift Roster";
            shiftInfo.type  = "Evening";
            return true;
        }

        if (0 < cell && cell < 6) {
            shiftInfo.title = "Owl+ Shift Roster";
            shiftInfo.type  = "Owl";
            return true;
        } else if (5 < cell && cell < 8) {
            shiftInfo.title = "Owl+ Shift Roster";
            shiftInfo.type  = "Owl";
            return true;
        } else if (7 < cell && cell < 13) {
            shiftInfo.title = "Day Shift Roster";
            shiftInfo.type  = "Day";
            return true;
        } else if (12 < cell && cell < 15) {
            shiftInfo.title = "Day+ Shift Roster";
            shiftInfo.type  = "Day";
            return true;
        } else if (14 < cell && cell <= 19) {
            shiftInfo.title = "Evening Shift Roster";
            shiftInfo.type  = "Evening";
            return true;
        }
    }

    return shiftInfo;
}

function makePost(array) {
    $.when(
        $.ajax('https://www-bd.fnal.gov/Elog/?orCategoryName=Shift+Change&entryLimit=1')) // Find most recent "Shift Change" note in Elog
        .done(function(html) {
            let entryID = parseForEntryID(html); // parse returned html for entryID
            rosterPost(entryID, array); // using entryID parse array for preformatted shift roster entry
        });
}

function parseForEntryID(htmlStr) {
    let el = $('<div></div>');
    el.html(htmlStr);

    return $('.id a', el).text(); // All the class="id" elements
}

function rosterPost(id, array) {
    let entryArray = [],
        formData = new FormData();

    entryArray.push('<u><strong>'+array[0]+'</strong></u>');
    entryArray.push('<ul>');
    entryArray.push('<li>'+array[1]+' <strong>CC</strong></li>');

    for (let i = 2; i < array.length; i++) {
        entryArray.push('<li>'+array[i]+'</li>');
    }

    entryArray.push('</ul>');

    let entryText = entryArray.join('');

    formData.append('entryId', id);
    formData.append('text', entryText);

    $.ajax({
            url: 'https://www-bd.fnal.gov/Elog/api/add/comment', // POST
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
        })
        .done(function() {
            alert("Comment Successfully submitted");
            console.log("POST success");
        })
        .fail(function() {
            alert("Something went wrong");
            console.log("POST error");
        });

}
