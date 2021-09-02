import { readable, writable } from 'svelte/store';

// Readable store for current location of user
export const currentPlace = readable({}, (set) => {
	// Update currentPlace when coordinates changed
	if (navigator.geolocation) {
		const id = navigator.geolocation.watchPosition((position) => {
			set({
				name: 'Current location',
				address: '',
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		});

		// Stop function called when last subscriber unsubscribes
		return () => navigator.geolocation.clearWatch(id);
	} else {
		alert('Geolocation is not supported by this browser');
	}
});

// Value of destination location searchbar
export const destinationQuery = writable({});

// Value of origin location searchbar
export const originQuery = writable({});
