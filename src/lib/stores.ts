import type { userLocation, place, route, busStop } from '$lib/types';
import { readable, writable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

// Readable store for current location of user
export const currentPlace: Readable<userLocation> = readable(
	{ name: 'Current location', hasPermission: false },
	(set) => {
		if (navigator.geolocation) {
			// Update currentPlace when coordinates changed
			const id = navigator.geolocation.watchPosition((position) => {
				set({
					name: 'Current location',
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					hasPermission: true
				});
			});

			// Stop function called when last subscriber unsubscribes
			return () => navigator.geolocation.clearWatch(id);
		} else {
			alert('Geolocation is not supported by this browser');
		}
	}
);

// Value of destination location searchbar
export const destinationQuery: Writable<place | userLocation> = writable({});

// Value of origin location searchbar
export const originQuery: Writable<place | userLocation> = writable({});

// Routes calculated on suggested-routes page
export const routes: Writable<route[]> = writable([]);
export const selectedRoute: Writable<route> = writable({});

export const serviceRoute: Writable<Promise<busStop[]>> = writable();

// Value of searchbar on set-[location] page
export const locationChipSearch = writable('');
