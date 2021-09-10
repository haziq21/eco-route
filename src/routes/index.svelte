<script context="module">
	// This component needs to access navigator (client-side)
	export const ssr = false;
</script>

<script lang="ts">
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import type { arrivals } from 'src/types/busArrivals.type';
	import type { busStop } from 'src/types/busStops.type';
	import { currentPlace, destinationQuery, originQuery } from './_stores';

	// Content of bus number / bus stop searchbar
	let searchText: string;

	// Clear destination query when user goes back to home page
	$destinationQuery = {
		name: '',
		address: '',
		longitude: null,
		latitude: null
	};

	// Reset origin query to user's current location when they go back to home page
	$: $originQuery = $currentPlace;

	// Search results
	let searchResults: busStop[] = [];
	$: if (searchText) searchBusStops(searchText).then((res) => (searchResults = res));

	// Fetches bus arrivals at bus stops nearby
	async function getNearbyArrivals() {
		const nearbyBusStops = await getNearbyBusStops();
		return Promise.all(nearbyBusStops.map(async (stop) => await getBusArrivals(stop)));
	}

	// Fetches bus arrival timings at a bus stop
	async function getBusArrivals(busStop: busStop): Promise<arrivals> {
		const res = await fetch(`/api/bus-arrivals?stop-code=${busStop.code}`);
		const data: arrivals = await res.json();
		data.busStopName = busStop.name;
		return data;
	}

	// Fetches bus stops within 500 metres of user
	async function getNearbyBusStops() {
		const data = await getAllBusStops();
		let nearbyStops: { distance: number; stop: busStop }[] = [];

		// Only get bus stops 0.5km away or less
		for (let i = 0; i < data.length; i++) {
			let distance = distanceBetween($currentPlace, data[i]);
			if (distance <= 0.5) nearbyStops.push({ distance, stop: data[i] });
		}

		// Sort bus stops by distance
		return nearbyStops
			.sort((stop1, stop2) => stop1.distance - stop2.distance)
			.map((stop) => stop.stop);
	}

	// Fetches all bus stops
	async function getAllBusStops() {
		const res = await fetch('/api/bus-stops');
		const data: busStop[] = await res.json();

		return data;
	}

	// Searches for bus stops by name or code
	async function searchBusStops(query: string) {
		// Case-insensitive keyword search
		const queries = query
			.toLowerCase()
			.split(' ')
			.filter((x) => x.length);
		const busStops = await getAllBusStops();
		let results: { matches: number; stop: busStop }[] = [];

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

	// Gets distance between two latitude-longitude points in km (using the Haversine formula)
	// From https://stackoverflow.com/a/27943
	function distanceBetween(
		{ latitude: lat1, longitude: lon1 },
		{ latitude: lat2, longitude: lon2 }
	) {
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

	// Converts degrees to radians
	function toRad(degrees: number) {
		return degrees * (Math.PI / 180);
	}
</script>

<Box>
	<h1>Bus arrivals</h1>
	<Searchbar placeholder="Search for a bus number or stop" bind:text={searchText} />
	{#if !searchText}
		{#await getNearbyArrivals()}
			<p>loading...</p>
		{:then response}
			{#each response as busStop}
				<BusArrivals arrivals={busStop} />
			{/each}
		{:catch error}
			<p>error: {error.message}</p>
		{/await}
	{:else}
		{#each searchResults as busStop}
			{busStop.name} {busStop.code}<br />
		{:else}
			No results
		{/each}
	{/if}
</Box>
