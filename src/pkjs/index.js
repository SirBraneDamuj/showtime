var Clay = require('@rebble/clay');
var clayConfig = require('./config');
var moddableProxy = require('@moddable/pebbleproxy');

var DEFAULTS = {
    ColorHour:      '0055FF',
    ColorMinute:    'AA0000',
    ColorRing:      'AAAA00',
    ColorInnerRing: 'FFFFFF'
};

var clay = new Clay(clayConfig, function(minified) {
    var config = this;
    config.on(config.EVENTS.AFTER_BUILD, function() {
        var defaults = config.meta.userData;
        config.getItemById('reset-defaults').on('click', function() {
            config.getItemByMessageKey('ColorHour').set(defaults.ColorHour);
            config.getItemByMessageKey('ColorMinute').set(defaults.ColorMinute);
            config.getItemByMessageKey('ColorRing').set(defaults.ColorRing);
            config.getItemByMessageKey('ColorInnerRing').set(defaults.ColorInnerRing);
        });
    });
}, { userData: DEFAULTS });

Pebble.addEventListener('ready', moddableProxy.readyReceived);
Pebble.addEventListener('appmessage', moddableProxy.appMessageReceived);
