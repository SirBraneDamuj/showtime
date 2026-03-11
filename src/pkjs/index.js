var Clay = require('@rebble/clay');
var clayConfig = require('./config');

var DEFAULTS = {
    ColorHour:      '0055FF',
    ColorMinute:    'AA0000',
    ColorRing:      'AAAA00',
    ColorInnerRing: 'FFFFFF'
};

var clay = new Clay(clayConfig, function() {
    var self = this;
    self.on(Clay.EVENTS.AFTER_BUILD, function() {
        self.getItemById('reset-defaults').on('click', function() {
            self.getItemByMessageKey('ColorHour').set(DEFAULTS.ColorHour);
            self.getItemByMessageKey('ColorMinute').set(DEFAULTS.ColorMinute);
            self.getItemByMessageKey('ColorRing').set(DEFAULTS.ColorRing);
            self.getItemByMessageKey('ColorInnerRing').set(DEFAULTS.ColorInnerRing);
        });
    });
});
