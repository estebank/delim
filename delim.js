var delim = {};  // Delayed image loader.
delim.debug = true;

if (delim.debug && console && console.log) {
    delim.log = function() { console.log.apply(console, arguments); };
} else {
    delim.log = function(){};
}

delim.pixel_size = window.devicePixelRatio || 1;
delim.pixel_size_threshold = 1.1;
delim.data_attribute = 'data-img-src';
delim.data_attribute_retina = 'data-img-src-retina';
delim.delayed_class = 'delim';
delim.loaded_class = 'img-load-done';

delim.retina = function(threshold) {
    if (typeof(threshold) == 'undefined') {
        threshold = delim.pixel_size_threshold;
    }
    return delim.pixel_size > threshold;
};

delim.replace_src = function(img, data_attribute) {
    delim.log('[delim] replacing src from \'' + img.getAttribute('src') +
              '\' to \'' + img.getAttribute(data_attribute) + '\'');
    img.setAttribute('src', img.getAttribute(data_attribute));
    img.className = img.className + ' ' + delim.loaded_class;
};

delim.load = function(delayed_class, data_attribute, data_attribute_retina, threshold) {
    if (typeof(delayed_class) == 'undefined') {
        delayed_class = delim.delayed_class;
    }
    if (typeof(data_attribute) == 'undefined') {
        data_attribute = delim.data_attribute;
    }
    if (typeof(data_attribute_retina) == 'undefined') {
        data_attribute_retina = delim.data_attribute_retina;
    }
    var retina = delim.retina(threshold);
    var retina_replace;
    delim.log('[delim] delayed class: ' + delayed_class +
              ' data attribute: ' + data_attribute + ' (retina: ' + data_attribute_retina + ')');
    var images = document.getElementsByClassName(delayed_class);
    var attrib = data_attribute;


    var img;
    var i = 0;
    for (; i<images.length; i++) {
        img = images[i];
        if (retina && img.getAttribute(data_attribute_retina)) {
            delim.replace_src(img, data_attribute_retina);
        } else {
            delim.replace_src(img, data_attribute);
        }
    }
};

delim.delayed_load = function(delay, delayed_class, data_attribute, data_attribute_retina, threshold) {
    if (typeof(delay) == 'undefined') {
        delay = 2000;
    }
    delim.log('[delim] delay: ' + delay + 'ms');
    setTimeout(function() { delim.load(delayed_class, data_attribute); }, delay);
};
