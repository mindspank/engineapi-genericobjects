'use strict';

// Full list of configuration options available at:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: false,

    transition: 'slide', // none/fade/slide/convex/concave/zoom

    dependencies: [
        { src: 'bower_components/reveal.js/lib/js/classList.js', condition: function () { return !document.body.classList; } },
        { src: 'bower_components/reveal.js/plugin/markdown/marked.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
        { src: 'bower_components/reveal.js/plugin/markdown/markdown.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
        { src: 'bower_components/reveal.js/plugin/highlight/highlight.js', async: true, condition: function () { return !!document.querySelector('[data-html]') || !!document.querySelector('pre code') || !!document.querySelector('[data-markdown]'); }, callback: function () { hljs.initHighlightingOnLoad(); } },
        { src: 'bower_components/reveal.js/plugin/zoom-js/zoom.js', async: true },
        { src: 'bower_components/reveal.js/plugin/notes/notes.js', async: true },
        { src: 'js/loadhtmlslides.js', condition: function () { return !!document.querySelector('[data-html]'); } }
    ]

});

Reveal.addEventListener('slidechanged', function (event) {
    // Make iframes interactive
    if ($(event.currentSlide).attr('data-background-iframe')) {
        $('.reveal > .backgrounds').css('z-index', 1);
    } else {
        $('.reveal > .backgrounds').css('z-index', 0);
    };
});

Reveal.addEventListener('ready', function (event) {
    
    /**
     * syntax demo
     */
    Reveal.addEventListener('syntaxdemo', function () {
        
        var connect;
        var res = $('#syntaxresponse');
        


            $('#syntaxdemoconnect').click(function() {
                $('#syntaxdemoconnect').text('Disconnect')
                connect = new WebSocket('ws://localhost:4848/app/engineData');
                connect.onmessage = function(msg) {
                    res.text( JSON.stringify(JSON.parse(msg.data), null, 2) + res.text() )
                }
                
                $('#syntaxdemosend').click(() => {
                    connect.send($('#syntaxrequest').text())
                });
                
            });
            
        
        
    });
    
    
    /**
     * qsocks demo
     */
    Reveal.addEventListener('createappsdemo', function () {
        
        $('#createappexecute').click(function() {
            $('#progressareacreateapps .progressspinner').show();
            createApp();
        });
        
        function createApp() {
            const appname = 'Qonnections Demo' + Date.now()
            qsocks.Connect()
            .then( (global) => global.createDocEx(appname) )
            .then((app) => {

                const loadscript =
                    `Load RecNo() as Dim, Rand() * 100 as Value
                        Autogenerate 100;`

                return app.setScript(loadscript)
                    .then(() => app.doReload())
                    .then(() => app.doSave())

            })
            .then(function() {
                $('#progressareacreateapps .progressspinner').fadeOut(function() {
                    $('#progressareacreateapps')
                    .append('<a href="http://localhost:4848/sense/app/' + encodeURI(appname) + '" target="_blank">Open App</a>')
                });
            })
            .catch(function(err) {
                console.log(err)
            });
        };
        
    });

});