var CACHE = "v1"

var filesToCache = [
    './',
    './resources/js/jquery.min.js',
    './resources/js/highlight.min.js',
    './resources/js/json-to-go.js',
    './resources/js/common.js',
    './resources/js/gofmt.js',
    './resources/css/tomorrow.highlight.css',
    './resources/css/common.css',
    './resources/images/json-to-go.png'
]

self.addEventListener('install', function (evt) {
    console.log('Attempting service worker installation.');

    // Wait until promise resolves
    evt.waitUntil(precache());
});

// On fetch, return from cache
self.addEventListener('fetch', function (evt) {
    evt.respondWith(serve(evt.request));
});

// Opens cache and loads filesToCache into cache for using them in future
function precache() {
    return caches
        .open(CACHE)
        .then(function (cache) {
            return cache.addAll(filesToCache);
        });
}

// When a resource is requested first serve from service worker and if service
// worker hasn't cached that request, then fetch that resource and then serve it
// This strategy is cache first.
function serve(request) {
    return caches
        .open(CACHE)
        .then(function (cache) {
            return cache
                .match(request)
                .then(function (matching) {
                    return matching || fetch(request);
                })
                .catch(console.error);
        });
}