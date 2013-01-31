$(function() {
    $("#commit-log").accordion(
        {
            collapsible: true, 
            active: false,
            heightStyle: "content"
        }); 
    $(".diff").each(
        (function(i) {
            $(this).html(
                ($(this).html().replace(/\{\+(.+?)\+\}/g, "<ins>$1</ins>")));
            $(this).html(
                ($(this).html().replace(/\[\-(.+?)\-\]/g, "<del>$1</del>")));
                }
            )
    )
});
