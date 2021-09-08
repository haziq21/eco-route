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
	import { onMount } from 'svelte';
	import { currentPlace, destinationQuery, originQuery } from './_stores';

	// Content of bus number / bus stop searchbar
	let searchText: string;

	// Service worker registration
	onMount(async () => {
		if ('serviceWorker' in navigator) {
			try {
				const registration = await navigator.serviceWorker.register('/sw.js');
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			} catch (e) {
				console.log('ServiceWorker registration failed: ', e);
			}
		}
	});

	// Fetched bus arrivals at bus stops nearby
	async function getNearbyArrivals() {
		const nearbyBusStops = await getNearbyBusStops();
		return Promise.all(nearbyBusStops.map(async (stop) => await getBusArrivals(stop.code)));
	}

	// Fetches bus arrival timings at a bus stop
	async function getBusArrivals(busStopCode: string): Promise<arrivals> {
		const res = await fetch(`/api/bus-arrivals?stop-code=${busStopCode}`);
		return await res.json();
	}

	// Fetches bus stops within 500 metres of user
	async function getNearbyBusStops() {
		const res = await fetch('/api/bus-stops');
		const data: busStop[] = await res.json();

		// Only return bus stops less than 0.5km away
		return data.filter((stop) => distanceBetween($currentPlace, stop) <= 0.5);
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

	// Clear destination query when user goes back to home page
	$destinationQuery = {
		name: '',
		address: '',
		longitude: null,
		latitude: null
	};

	// Reset origin query to user's current location when they go back to home page
	$: $originQuery = $currentPlace;
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
		text
	{/if}
</Box>
