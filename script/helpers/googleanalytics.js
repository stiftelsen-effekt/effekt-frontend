module.exports = {
    api_url: "https://data.gieffektivt.no/",

    send: function(eventAction, eventLabel, eventValue) {
        if (window.ga) {
            ga('send', {
                hitType: 'event',
                eventCategory: 'widget',
                eventAction,
                eventLabel,
                eventValue
            });
        }
        else {
            console.info("No google analytics tracking detected")
        }
    }
}
