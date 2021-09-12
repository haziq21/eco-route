<script context="module">
	// This component needs to access navigator (client-side)
	export const ssr = false;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import { onDestroy } from 'svelte';
	import { currentPlace, destinationQuery, originQuery } from '$lib/stores';
	import { searchBusStops, searchBusses, getNearbyArrivals } from '$lib/api';
	import type { busStop, service, arrivals } from '$lib/types';

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

	// Get nearby arrivals immediately instead of waiting for setInterval.
	// Reactive declaration so that it updates when $currentPlace is finally fetched.
	// (there is some geolocation delay when the app loads)
	$: getNearbyArrivals($currentPlace).then((res) => (nearbyArrivals = res));

	// Update arrivals every 30 seconds
	let arrivalInterval = setInterval(() => {
		getNearbyArrivals($currentPlace).then((res) => (nearbyArrivals = res));
	}, 30000);
</script>

<Box>
	<h1>Bus arrivals</h1>
	<Searchbar
		placeholder="Search for a bus number or stop"
		bind:text={searchText}
		on:focus={() => goto('/#box', { keepfocus: true, replaceState: true })}
	/>

	<!-- Show bus arrivals if searchbox is blank -->
	{#if !searchText}
		{#if !$currentPlace.latitude}
			<p>Getting current location...</p>
		{:else if nearbyArrivals}
			{#each nearbyArrivals as busStop}
				<BusArrivals arrivals={busStop} />
			{/each}
		{:else}
			<p>Loading bus arrivals...</p>
		{/if}
	{:else}
		<!-- Bus service search results -->
		{#if searchResults.services.length}
			<p>Bus services</p>
		{/if}
		<ul>
			{#each searchResults.services as service}
				<li>
					<a href="/bus-service/{service.number}/{service.origin}-{service.destination}">
						{service.number}
					</a>
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
					<a href="/bus-stop/{busStop.code}/{busStop.name}">{busStop.name} {busStop.code}</a>
				</li>
			{/each}
		</ul>

		<!-- No results -->
		{#if !searchResults.stops.length && !searchResults.services.length}
			<p>No results...</p>
		{/if}
	{/if}
</Box>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
