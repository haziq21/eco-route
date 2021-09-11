/* This module provides utility functions for the APIs */

import type { arrivals, service, busStop, place } from '$lib/types';

// Converts degrees to radians
function toRad(degrees: number) {
	return degrees * (Math.PI / 180);
}

// Gets distance between two latitude-longitude points in km (using the Haversine formula)
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

// Fetches bus arrival timings at a bus stop.
export async function getBusArrivals(busStop: busStop): Promise<arrivals> {
	const res = await fetch(`/api/bus-arrivals?stop-code=${busStop.code}`);
	const data: arrivals = await res.json();
	// OneMap doesn't provide the names of bus stops on their bus arrivals API
	data.busStopName = busStop.name;
	return data;
}

// Fetches all bus stops
async function getAllBusStops(): Promise<busStop[]> {
	const res = await fetch('/api/bus-stops');
	const data = await res.json();

	return data;
}

// Searches for bus stops by name or code
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

// Search for bus services by bus number
export async function searchBusses(query: string): Promise<service[]> {
	const res = await fetch('/api/bus-services');
	const data: service[] = await res.json();

	// Return first 10 bus services with bus numbers that match the query
	return data.filter((service) => service.number.includes(query)).slice(0, 11);
}

// Fetches bus stops within 500 metres of user
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

// Fetches bus arrivals at bus stops nearby
export async function getNearbyArrivals(here: place): Promise<arrivals[]> {
	const nearbyBusStops = await getNearbyBusStops(here);
	return Promise.all(nearbyBusStops.map(async (stop) => await getBusArrivals(stop)));
}
