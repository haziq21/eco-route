<script>
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import { onMount } from 'svelte';

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

	// console.log(getBusStops());

	// console.log(`data returned to index.svelte: ${getBusStops()}`);
</script>

<Box>
	{#await getBusStops() then response}
		<!-- {JSON.stringify(response.data)} -->
	{/await}
	<h1>Bus arrivals</h1>
	<Searchbar placeholder="Search for a bus number or stop" />
	{#await getBusArrivals()}
		<p>loading...</p>
	{:then response}
		<BusArrivals arrivals={response.data} />
	{:catch}
		<p>error...</p>
	{/await}
</Box>
