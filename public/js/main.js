$(document).ready(function() {
    $(".visit-button").tooltip({
        placement: 'bottom',
        container: 'body'
    });
    ZeroClipboard.setDefaults({
        moviePath: "/js/ZeroClipboard.swf",
        loop: true
    });
    $(".copy-button").each(function(i, o) {
        $(o).attr('data-clipboard-text', $(o).siblings('input').val());
        var clip = new ZeroClipboard(o);

        clip.on('load', function(client) {
            return $(clip.htmlBridge).attr('title', $(o).attr('data-title')).tooltip({placement: 'bottom'})
        });
        clip.on('complete', function(client,args) {
           $(clip.htmlBridge).attr('title', $(o).attr('data-complete-title')).tooltip('fixTitle').tooltip('show');
           return $(clip.htmlBridge).attr('title', $(o).attr('data-title')).tooltip('fixTitle')
        });
        clip.on('noflash wrongflash', function(client,args) {
            $(o).parent('.input-append').removeClass('input-append');
            return $(".js-zeroclipboard").hide()
        });
    });
});
