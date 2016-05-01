'use strict';

function parseForEntryID(htmlStr) {
    var el = $('<div></div>');
    el.html(htmlStr);

    return $('.id a', el).text(); // All the class="id" elements
}

function rosterPost(id) {
    var entryText = "<u><strong>Owl+ Shift Roster</strong></u><ul><li>Michael Wren <strong>CC</strong></li><li>Kelli Rubrecht</li><li>Michael Olander</li><li>John Kolpin</li><li>Beau Harrison</li></ul>";
    var formData = new FormData();
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

function makePost() {
    $.when(
            $.ajax('https://www-bd.fnal.gov/Elog/?categoryNames=Shift+Change&limit=1'))
        .done(function(html) {
            var entryID = parseForEntryID(html);
            rosterPost(entryID);
        });
}