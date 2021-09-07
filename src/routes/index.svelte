<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import { onMount } from 'svelte';
	import { currentPlace, destinationQuery, originQuery } from './_stores';

	onMount(async () => {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js');
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		} catch (e) {
			console.log('ServiceWorker registration failed: ', e);
		}
	});

	async function getBusArrivals() {
		const res = await fetch('/api/bus-arrivals');
		const data = await res.json();
		return data;
	}

	async function getBusStops() {
		const res = await fetch('/api/bus-stops');
		const data = await res.json();

		return data;
	}

	$destinationQuery = {
		name: '',
		address: '',
		longitude: null,
		latitude: null
	};
	$: $originQuery = $currentPlace;

	let searchText: string;
</script>

<Box>
	<h1>Bus arrivals</h1>
	<Searchbar placeholder="Search for a bus number or stop" bind:text={searchText} />
	{#if !searchText}
		{#await getBusArrivals()}
			<p>loading...</p>
		{:then response}
			<!-- <p>{JSON.stringify(response)}</p> -->
			<BusArrivals arrivals={response.data} />
		{:catch error}
			<p>error: {error.message}</p>
		{/await}
	{:else}
		text
	{/if}
</Box>
