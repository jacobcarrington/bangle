/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'bangle',
        defaults = {
            bangleWidth: 100,
            bangleAngle: -45,
            bangleFloat: "left"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin

        this._defaults = defaults;
        this._name = pluginName;

        var options = $.extend( {}, defaults, options, element.data()) ;

        var app = {
                $boxForPosition: false,
                $boxForCrop: false,
                $boxForImage: false,
                x1: false,
                y1: false,
                h1: false,
                h2: false,
                data: {},
                addClasses: function(){
                    app.$boxForPosition.addClass(options.cssNamespace);
                    if(options.bangleWidth) app.$boxForPosition.addClass(options.cssNamespace + '--' + options.bangleWidth);
                    if(options.bangleAngle) app.$boxForPosition.addClass(options.cssNamespace + '--' + options.bangleAngle);
                    if(options.bangleFloat) app.$boxForPosition.addClass(options.cssNamespace + '--' + options.bangleFloat);
                },
                calcH: function(callback){
                    app.x1 = app.$boxForPosition.parent().width();
                    app.y1 = app.$boxForPosition.height();
                    app.h1 = Math.sqrt((app.y1*app.y1) + (app.y1*app.y1));
                    app.h2 = Math.sqrt((app.x1*app.x1) + (app.x1*app.x1));
                    callback();
                },
                setDimensions(){
                    app.$boxForCrop.height(app.h2);
                    app.$boxForCrop.width(app.h2);
                    app.$boxForCrop.css('margin-right', 0 - app.y1);
                    app.$boxForPosition.css('margin-right', app.y1);

                },
                updateDimensions(){
                    app.calcH(app.setDimensions);
                }
            };

        this.options = options;
        this.app = app;
        this.init();
    }

    Plugin.prototype.init = function () {
        app.$boxForPosition = $(_defaults.target);
        app.$boxForCrop = app.$boxForPosition.children();
        app.$boxForImage = app.$boxForCrop.children();

        options = $.extend({},  _defaults, options, app.$boxForPosition.data());

        console.log(options);

        app.addClasses();
        app.updateDimensions();

        $(window).on('resize', function(){
            window.requestAnimationFrame(app.updateDimensions);
        })
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
