/* This module provides utility functions for convenience */

import JSONCrush from '$lib/JSONCrush';
import type { arrivals, service, busStop, place, route } from '$lib/types';

// Helper functions to interface with the APIs

/** Converts degrees to radians */
function toRad(degrees: number) {
	return degrees * (Math.PI / 180);
}

/** Gets distance between two latitude-longitude points in km (using the Haversine formula) */
// From https://stackoverflow.com/a/27943
function distanceBetween(
	{ latitude: lat1, longitude: lon1 },
	{ latitude: lat2, longitude: lon2 }
): number {
	// Radius of the earth in km
	const R = 6371;
	const latDiff = toRad(lat2 - lat1);
	const lonDiff = toRad(lon2 - lon1);

	const a =
		Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	// Distance in km
	return R * c;
}

/** Fetches bus arrival timings at a bus stop */
export async function getBusArrivals(busStop: busStop): Promise<arrivals> {
	const res = await fetch(`/api/bus-arrivals/${busStop.code}`);
	const data: arrivals = await res.json();
	// OneMap doesn't provide the names of bus stops on their bus arrivals API
	data.busStopName = busStop.name;
	return data;
}

/** Fetches all bus stops */
// This is slow and everything that uses this is also slow.
async function getAllBusStops(): Promise<busStop[]> {
	const res = await fetch('/api/bus-stops');
	const data = await res.json();

	return data;
}

/** Fetches a bus stop from its bus stop code */
export async function getBusStop(code: string): Promise<busStop> {
	const data = await getAllBusStops();
	return data.find((busStop) => busStop.code === code);
}

/** Searches for bus stops by name or code */
export async function searchBusStops(query: string): Promise<busStop[]> {
	// Case-insensitive keyword search
	const queries = query
		.toLowerCase()
		.split(' ')
		.filter((x) => x.length);
	const busStops = await getAllBusStops();
	const results: { matches: number; stop: busStop }[] = [];

	for (let i = 0; i < busStops.length; i++) {
		// Count the number of keyword matches
		const matches = queries.reduce((total, current) => {
			if (busStops[i].name.toLowerCase().includes(current) || busStops[i].code.includes(current))
				return total + 1;
			return total;
		}, 0);

		// If it matches, store the bus stop and its number of matches
		if (matches) {
			results.push({ matches, stop: busStops[i] });
		}
	}

	// Return the first 10 bus stops with the most matches
	return results
		.sort((stop1, stop2) => stop2.matches - stop1.matches)
		.slice(0, 11)
		.map((stop) => stop.stop);
}

/** Search for bus services by bus number */
export async function searchBusses(query: string): Promise<service[]> {
	const res = await fetch('/api/bus-services');
	const data: service[] = await res.json();

	// Return first 10 bus services with bus numbers that match the query
	return data.filter((service) => service.number.includes(query)).slice(0, 20);
}

/** Fetches bus stops within 500 metres of user */
async function getNearbyBusStops(here: place) {
	const data = await getAllBusStops();
	const nearbyStops: { distance: number; stop: busStop }[] = [];

	// Only get bus stops 0.5km away or less
	for (let i = 0; i < data.length; i++) {
		const distance = distanceBetween(here, data[i]);
		if (distance <= 0.5) nearbyStops.push({ distance, stop: data[i] });
	}

	// Sort bus stops by distance
	return nearbyStops
		.sort((stop1, stop2) => stop1.distance - stop2.distance)
		.map((stop) => stop.stop);
}

/** Fetches bus arrivals at bus stops nearby */
export async function getNearbyArrivals(here: place): Promise<arrivals[]> {
	const nearbyBusStops = await getNearbyBusStops(here);
	return Promise.all(nearbyBusStops.map(async (stop) => await getBusArrivals(stop)));
}

/** Fetches places based on a search query */
export async function getPlaces(search: string): Promise<place[]> {
	const res = await fetch('/api/places/' + search);
	const data = await res.json();

	return data;
}

/** Gets a bus route for a given bus service */
export async function getBusRoute(busService: string): Promise<busStop[]> {
	// I know this is slow and ineffecient
	const busStops = await getAllBusStops();
	const res = await fetch(`/api/bus-routes/${busService}?direction=1`);
	const data: string[] = await res.json();

	const route = data.map((stopCode) => busStops.find((busStop) => busStop.code === stopCode));

	return route;
}

/** Gets a place from localStorage if available */
export function getPlaceFromStorage(storageKey: string): place | undefined {
	const locationString = localStorage.getItem(storageKey);

	if (locationString) {
		return JSON.parse(locationString);
	}
}

// Helper functions to convert JSON objects into URL-friendly strings

/** Compresses an object into a string */
export function compressJSON(data: Record<string, unknown>): string {
	return encodeURIComponent(JSONCrush.crush(JSON.stringify(data)));
}

/** Uncompresses a string into an object */
export function uncompressJSON(data: string): Record<string, unknown> {
	return JSON.parse(decodeURIComponent(JSONCrush.uncrush(data)));
}

// Helper functions to generate templated HTML, meant to be used with {@html ...}

/** Wraps a string in a span tag */
export function wrapInSpan(text: string | number, classes = 'number'): string {
	return `<span class="${classes}">${text}</span>`;
}

/** Gets HTML for the arrival time of a route */
export function getArriveTimeHTML({ arriveTime }: route): string {
	const timeString = new Date(arriveTime).toLocaleString('en', {
		hour: 'numeric',
		minute: 'numeric'
	});
	const timeHTML = 'Leave now, arrive at ' + wrapInSpan(timeString);

	return wrapInSpan(timeHTML, 'extra');
}

/** Gets HTML for the duration of a route */
export function getDurationHTML({ duration }: route): string {
	const hours = Math.floor(duration / 3600);
	const minutes = Math.floor((duration - hours * 3600) / 60);

	if (hours || minutes) {
		const hourString = hours ? wrapInSpan(hours) + ' hr' : '';
		const minuteString = minutes ? wrapInSpan(minutes) + ' min' : '';

		return wrapInSpan(`${hourString} ${minuteString}`, 'time');
	} else {
		return wrapInSpan('Instant', 'time'); // Just in case...
	}
}
