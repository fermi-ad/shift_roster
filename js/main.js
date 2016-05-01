'use strict';

function getEntryID() {
    var entryID;
    $.ajax({
            url: 'https://www-bd.fnal.gov/Elog/?categoryNames=Shift+Change&limit=1',
            type: 'GET',
            async: false
        })
        .done(function(data) {
            entryID = parseForEntryID(data);
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

    return entryID;
}

function parseForEntryID(htmlStr) {
    var el = $('<div></div>');
    el.html(htmlStr);

    return $('.id a', el).text(); // All the class="id" elements
}