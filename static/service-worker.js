// This service worker is automatically registered when built with Vite
// import { build, files, timestamp } from '$service-worker';

const CACHE_NAME = 'ecoroute-cache-v1';

function isValid(res) {
	// Invalid if there is no cached response
	if (!res) return false;
	const fetchedOn = res.headers.get('sw-fetched-on');

	// If res doesn't have the sw-fetched-on header,
	// assume it doesn't need to expire (assume it's valid).
	// Only calls to /api/bus-arrivals should have this header.
	if (!fetchedOn) return true;

	// Expire bus arrival timings after 30 seconds
	if (parseFloat(fetchedOn) + 30000 > new Date().getTime()) return true;

	return false;
}

self.addEventListener('install', (event) => {
	console.log('installing service-worker.js');
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	event.respondWith(
		caches
			.match(request)
			.then((response) => {
				// Cache hit
				if (isValid(response)) {
					console.log(`Cache hit for ${request.url}`);
					return response;
				}

				// Cache miss or invalid, so forward request to network
				return fetch(request.clone()).then((fetchResponse) => {
					// Response received is invalid, don't cache it
					if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
						console.log(`Cache miss for ${request.url}, NOT caching response`);
						return fetchResponse;
					}

					// Clone fetchResponse outside of event.waitUntil because by the time the .then() 
					// is called, fetchResponse would have already been returned (hence consumed)
					const responseCopy = fetchResponse.clone();

					// Response received is valid, cache for offline access
					event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
						console.log(`Cache miss from ${request.url}, caching response`);

						// Set expiration header for bus arrivals
						if (request.url.includes('/api/bus-arrivals')) {
							// Receate response headers and append the sw-fetched-on header
							const headers = new Headers(responseCopy.headers);
							headers.append('sw-fetched-on', new Date().getTime());

							// Cache the response
							return responseCopy.blob().then((body) => {
								return cache.put(
									request,
									new Response(body, {
										status: responseCopy.status,
										statusText: responseCopy.statusText,
										headers
									})
								);
							});
						} else {
							// Cache the response
							return cache.put(request, responseCopy);
						}
					}));

					// Return the requested file
					return fetchResponse;
				});
			})
			.catch((error) => {
				console.error('Error in fetch handler: ', error);

				throw error;
			})
	);
});