<script context="module">
	// This component needs to access navigator (client-side)
	export const ssr = false;
</script>

<script lang="ts">
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import type { arrivals } from 'src/types/busArrivals.type';
	import type { service } from 'src/types/busServices.type';
	import type { busStop } from 'src/types/busStops.type';
	import type { place } from 'src/types/places.type';
	import { onDestroy } from 'svelte';
	import { currentPlace, destinationQuery, originQuery } from './_stores';

	onDestroy(() => clearInterval(arrivalInterval));

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
	let searchResults: { stops: busStop[]; services: service[] } = { stops: [], services: [] };
	$: if (searchText) {
		searchBusStops(searchText).then((res) => (searchResults.stops = res));
		searchBusses(searchText).then((res) => (searchResults.services = res));
	}

	let nearbyArrivals: arrivals[];
	// Update arrivals every 30 seconds
	let arrivalInterval = setInterval(() => {
		getNearbyArrivals($currentPlace).then((res) => (nearbyArrivals = res));
	}, 30000);

	// Fetches bus arrivals at bus stops nearby
	async function getNearbyArrivals(here: place) {
		const nearbyBusStops = await getNearbyBusStops(here);
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
	async function getNearbyBusStops(here: place) {
		const data = await getAllBusStops();
		let nearbyStops: { distance: number; stop: busStop }[] = [];

		// Only get bus stops 0.5km away or less
		for (let i = 0; i < data.length; i++) {
			let distance = distanceBetween(here, data[i]);
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

	async function searchBusses(query: string) {
		const res = await fetch('/api/bus-services');
		const data: service[] = await res.json();

		// Return first 10 bus services with bus numbers that match the query
		return data.filter((service) => service.number.includes(query)).slice(0, 11);
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
		{#if nearbyArrivals}
			{#each nearbyArrivals as busStop}
				<BusArrivals arrivals={busStop} />
			{/each}
		{:else}
			loading...
		{/if}
	{:else}
		{#if searchResults.services.length}
			<p>Bus services</p>
		{/if}
		<ul>
			{#each searchResults.services as service}
				<li>
					<a href="/bus-service/{service.number}">{service.number}</a>
				</li>
			{/each}
		</ul>
		<!-- Bus stop search results -->
		{#if searchResults.stops.length}
			<p>Bus stops</p>
		{/if}
		<ul>
			{#each searchResults.stops as busStop}
				<li>
					<a href="/bus-stop/{busStop.code}">{busStop.name} {busStop.code}</a>
				</li>
			{/each}
		</ul>
	{/if}
</Box>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
