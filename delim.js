var delim = {};  // Delayed image loader.
delim.debug = true;

if (delim.debug && console && console.log) {
    delim.log = function() { console.log.apply(console, arguments); };
} else {
    delim.log = function(){};
}

delim.data_attribute = 'data-img-src';
delim.delayed_class = 'delim';
delim.loaded_class = 'img-load-done';

delim.load = function(delayed_class, data_attribute) {
    if (typeof(delayed_class) == 'undefined') {
        delayed_class = delim.delayed_class;
    }
    if (typeof(data_attribute) == 'undefined') {
        data_attribute = delim.data_attribute;
    }
    delim.log('[delim] delayed class: ' + delayed_class +
              ' data attribute: ' + data_attribute);
    var images = document.getElementsByClassName(delayed_class);

    var img;
    var i = 0;
    for (; i<images.length; i++) {
        img = images[i];
        delim.log('[delim] replacing src from \'' + img.getAttribute('src') +
                  '\' to \'' + img.getAttribute(data_attribute) + '\'');
        img.setAttribute('src', img.getAttribute(data_attribute));
        img.className = img.className + ' ' + delim.loaded_class;
    }
};

delim.delayed_load = function(delay, delayed_class, data_attribute) {
    if (typeof(delay) == 'undefined') {
        delay = 2000;
    }
    delim.log('[delim] delay: ' + delay + 'ms');
    setTimeout(function() { delim.load(delayed_class, data_attribute); }, delay);
};
