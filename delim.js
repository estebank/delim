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

delim.replaceSrc = function(img, data_attribute) {
    delim.log('[delim] replacing src from \'' + img.getAttribute('src') +
              '\' to \'' + img.getAttribute(data_attribute) + '\'');
    img.setAttribute('src', img.getAttribute(data_attribute));
    img.className = img.className + ' ' + delim.loaded_class;
};

delim.loadImage = function(img, data_attribute, data_attribute_retina, retina_threshold) {
    var attrib = data_attribute;
    var retina = delim.retina(retina_threshold);
    if (retina && img.getAttribute(data_attribute_retina)) {
        attrib = data_attribute_retina;
    }
    delim.replaceSrc(img, attrib);
};

delim.loadImages = function(images, data_attribute, data_attribute_retina, retina_threshold) {
    var img;
    var i = 0;
    for (; i<images.length; i++) {
        img = images[i];
        delim.loadImage(img, data_attribute, data_attribute_retina, retina_threshold);
    }
}

delim.load = function(delayed_class, data_attribute, data_attribute_retina, retina_threshold) {
    if (typeof(delayed_class) == 'undefined') {
        delayed_class = delim.delayed_class;
    }
    if (typeof(data_attribute) == 'undefined') {
        data_attribute = delim.data_attribute;
    }
    if (typeof(data_attribute_retina) == 'undefined') {
        data_attribute_retina = delim.data_attribute_retina;
    }
    delim.log('[delim] delayed class: ' + delayed_class +
              ' data attribute: ' + data_attribute + ' (retina: ' + data_attribute_retina + ')');
    var images = document.getElementsByClassName(delayed_class);
    delim.loadImages(images, data_attribute, data_attribute_retina, retina_threshold);
};

delim.delayedLoad = function(delay, delayed_class, data_attribute, data_attribute_retina, retina_threshold) {
    if (typeof(delay) == 'undefined') {
        delay = 2000;
    }
    delim.log('[delim] delay: ' + delay + 'ms');
    setTimeout(function() { delim.load(delayed_class, data_attribute, data_attribute_retina, retina_threshold); }, delay);
};

// http://stackoverflow.com/a/1542908/34813
delim.offsetY = function(elm) {
    var test = elm, top = 0;

    while (!!test && test.tagName.toLowerCase() !== "body") {
        top += test.offsetTop;
        test = test.offsetParent;
    }
    return top;
}

delim.viewportHeight = function() {
    var documentElement = document.documentElement;

    if (!!window.innerWidth) {
        return window.innerHeight;
    } else if (documentElement && !isNaN(documentElement.clientHeight)) {
        return documentElement.clientHeight;
    }
    return 0;
}

delim.pageYOffset = function() {
    if (window.pageYOffset) { return window.pageYOffset; }
    return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
}

delim.visible = function(elm, slack) {
    if (typeof(slack) == 'undefined') { slack = 0; }
    var d = delim;
    delim.log(d.offsetY(elm), d.viewportHeight(), d.pageYOffset(), slack);
    return (d.offsetY(elm) <= (d.viewportHeight() + d.pageYOffset() + slack));
}


delim.delim = function() {
    delim.log('[delim] auto delayed load');
    var images = document.getElementsByTagName('img');
    delim.log(images);
    var load_now = [];
    var load_soon = [];
    var load_last = [];
    var fold_slack = 500; // 500px from the fold.
    var delay_soon = 3000;  // load images near the fold 5 seconds after load.
    var delay_last = 7000;  // load other images 10 seconds after load.
    var img;
    var i = 0;
    for (; i<images.length; i++){
        img = images[i];
        if (delim.visible(img)) {  // img is visible right now.
            load_now.push(img);
            delim.log('y offset',delim.offsetY(img));
        } else if (delim.visible(img, fold_slack)) {  // img is within 500px of the fold.
            load_soon.push(img);
        } else {  // img can be loaded last.
            load_last.push(img);
        }
    }
    delim.log(load_now, load_soon, load_last);
    delim.loadImages(load_now, delim.data_attribute, delim.data_attribute_retina);
    setTimeout(function() {
        delim.loadImages(load_soon, delim.data_attribute, delim.data_attribute_retina);
    }, delay_soon);
    setTimeout(function() {
        delim.loadImages(load_last, delim.data_attribute, delim.data_attribute_retina);
    }, delay_last);
}
