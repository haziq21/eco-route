<script>
	import Box from '$lib/Box.svelte';
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
		console.log('getBusArrivals()');
		const res = await fetch('/api/bus-arrivals');
		const data = await res.json();

		return data;
	}
</script>

<Box>
	<h1>Bus arrivals</h1>
	<Searchbar placeholder="Search for a bus number or stop" />
	{#await getBusArrivals()}
		<p>loading...</p>
	{:then response}
		{console.log(response)}
		<p>{JSON.stringify(response.data)}</p>
	{/await}
</Box>
