<script lang="ts">
	import { slide } from 'svelte/transition';
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import { onDestroy } from 'svelte';
	import { currentPlace, destinationQuery, originQuery } from '$lib/stores';
	import { searchBusStops, searchBusses, getNearbyArrivals } from '$lib/utilities';
	import type { busStop, service, arrivals } from '$lib/types';
	import BackButton from '$lib/BackButton.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Redirect invalid URLs to homepage
	if (!['', 'search-busses'].includes($page.params.view)) goto('/');

	// Declaring this logic here to reduce clutter in HTML
	$: searchingBusses = $page.params.view === 'search-busses';

	window.onpopstate = () => {
		if ($searchingBusses) $searchingBusses = false;
	};

	// Content of bus number / bus stop searchbar
	let searchText: string;

	// Search results
	let searchResults: { stops: busStop[]; services: service[] } = { stops: [], services: [] };
	$: if (searchText) {
		searchBusStops(searchText).then((res) => (searchResults.stops = res));
		searchBusses(searchText).then((res) => (searchResults.services = res));
	}

	// Clear destination query when user goes back to home page
	$destinationQuery = {
		name: '',
		address: '',
		longitude: null,
		latitude: null
	};

	let nearbyArrivals: arrivals[];
	let arrivalInterval: NodeJS.Timeout;
	onDestroy(() => clearInterval(arrivalInterval));

	// Don't load this if we don't have geolocation permission
	$: if ($currentPlace.hasPermission) {
		// Reset origin query to user's current location when they go back to home page
		$originQuery = $currentPlace;

		// Get nearby arrivals immediately instead of waiting for setInterval.
		getNearbyArrivals($currentPlace).then((res) => (nearbyArrivals = res));

		// Update arrivals every 30 seconds
		arrivalInterval = setInterval(() => {
			getNearbyArrivals($currentPlace).then((res) => (nearbyArrivals = res));
		}, 30000);
	} else {
		clearInterval(arrivalInterval);
	}
</script>

<Box>
	{#if !searchingBusses}
		<h1 transition:slide|local>Bus arrivals</h1>
	{/if}
	<div class="side-by-side">
		{#if searchingBusses}
			<BackButton
				colour="icon-text"
				action={() => {
					history.back();
				}}
			/>
		{/if}
		<Searchbar
			placeholder="Search for a bus number or stop"
			bind:text={searchText}
			on:click={() => {
				if (!searchingBusses) goto('/search-busses', { keepfocus: true });
			}}
		/>
	</div>

	<!-- Show bus arrivals if searchbox is blank -->
	{#if !searchingBusses}
		<!-- User needs to explicitly allow location permission -->
		{#if !$currentPlace.hasPermission}
			<p class="location-permission">Enable location permissions to show nearby bus stops</p>
		{:else if !$currentPlace.latitude}
			<p>Getting current location...</p>
		{:else if !nearbyArrivals}
			<p>Loading bus arrivals...</p>
		{:else}
			{#each nearbyArrivals as busStop}
				<BusArrivals arrivals={busStop} />
			{/each}
		{/if}
	{:else}
		<!-- Bus service search results -->
		{#if searchResults.services.length}
			<h3>Bus services</h3>
		{/if}
		<div class="bus-services">
			{#each searchResults.services as service}
				<a class="service-number" href="/bus-service/{service.number}">
					{service.number}
				</a>
			{/each}
		</div>

		<!-- Bus stop search results -->
		{#if searchResults.stops.length}
			<h3>Bus stops</h3>
		{/if}
		<ul>
			{#each searchResults.stops as busStop}
				<li>
					<a href="/bus-stop/{busStop.code}/{busStop.name}">
						<span class="bus-stop-code">{busStop.code}</span>
						{busStop.name}
					</a>
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
	.bus-services {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin: -3px;
	}
	.bus-services > a {
		padding: 3px 6px;
		margin: 3px;
		border-radius: var(--border-radius-sm);
		background-color: var(--header);
		color: var(--overlay);
		text-align: center;
	}

	.side-by-side {
		display: flex;
		flex-direction: row;
	}

	.location-permission {
		margin: 30px auto;
		text-align: center;
		color: rgb(117, 175, 135);
		font-size: 0.8rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		margin: var(--space-sm) auto;
	}

	h3 {
		margin-bottom: var(--space-md);
	}

	.bus-stop-code {
		/* color: var(--background); */
		font-weight: bold;
	}
</style>
