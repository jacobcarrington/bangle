/*
    Name: Bangle
 Version: 2.0.0
  Author: Jacob Carrington
 Website:
    Docs:
    Repo:
  Issues:

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Bangle = window.bangle || {};

    Bangle = (function() {

        var instanceUid = 0;

        function Bangle(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                angle: -45,
                side: 'left'
            };

            _.initials = {
                $boxForCrop: null,
                $boxForImage: null,
                x1: 0,
                y1: 0,
                h1: 0,
                h2: 0,
                bangles: 0,
            };

            $.extend(_, _.initials);

            _.$bangle = $(element);

            dataSettings = $(element).data('bangle') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.originalSettings = _.options;

            _.instanceUid = instanceUid++;

            _.init(true);

        }

        Bangle.prototype.init = function(creation) {

            var _ = this;

            if (!$(_.$bangle).hasClass('bangle')) {
                $(_.$bangle).addClass('bangle');
            }
            if (!$(_.$bangle).hasClass('bangle--initialized')) {
                $(_.$bangle).addClass('bangle--initialized');
            }

            if (creation) {
                _.$bangle.trigger('init', [_]);
            }

            _.bangles = _.$bangle.parent().children().length;

            _.$boxForCrop = _.$bangle.children();
            _.$boxForImage = _.$boxForCrop.children();

            _.addClasses();
            _.calcH();
            _.setDimensions();

            $(window).on('resize', function(){
                window.requestAnimationFrame(function(){
                    _.calcH();
                    _.setDimensions();
                });
            })



            console.log(_);

        };

        Bangle.prototype.addClasses = function(){
            var _ = this;

            if(_.options.width) _.$bangle.addClass('bangle--width-' + _.options.width + '-percent');
            if(_.options.angle) _.$bangle.addClass('bangle--angle-' + _.options.angle);
            if(_.options.side) _.$bangle.addClass('bangle--on-the-' + _.options.side);
        };
        Bangle.prototype.calcH = function(){
            var _ = this;

            _.x1 = _.$bangle.parent().width();
            _.y1 = _.$bangle.height();
            _.h1 = Math.sqrt((_.y1*_.y1) + (_.y1*_.y1));
            _.h2 = Math.sqrt((_.x1*_.x1) + (_.x1*_.x1));
        };
        Bangle.prototype.setDimensions = function(){
            var _ = this;

            console.log(_);
            _.$boxForImage.height(_.y1);
            _.$boxForCrop.height(_.h2);
            _.$boxForCrop.width(_.h2);
            _.$boxForCrop.css('margin-' + _.options.side, 0 - _.y1);
            _.$bangle.width((_.x1 / _.bangles) - ( _.y1 / _.bangles));

        };

        return Bangle;

    }());

    $.fn.bangle = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].bangle = new Bangle(_[i], opt);
            else
                ret = _[i].bangle[opt].apply(_[i].bangle, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));
