<script lang="ts">
	import { page } from '$app/stores';
	import Box from '$lib/Box.svelte';
	import { destinationQuery, originQuery } from './__layout.svelte';

	async function getPlaces(search: string) {
		const res = await fetch('/api/places?search=' + search);
		const data = await res.json();

		return data;
	}

	// if (navigator.geolocation) {
	// 	navigator.geolocation.getCurrentPosition((position) => {
	// 		console.log(`${position.coords.longitude}, ${position.coords.latitude}`);
	// 	});
	// }

	let searchResults = [];

	// Select the active query
	const locationQuery = $page.params.endpoint === 'destination' ? destinationQuery : originQuery;
	$: getPlaces($locationQuery).then((result) => (searchResults = result.data));
</script>

<Box>
	{#if !$locationQuery}
		<a href="/suggested-routes" on:click={() => ($locationQuery = 'Current location')}>
			Current location<br />
		</a>
	{/if}
	{#each searchResults as location}
		<a href="/suggested-routes" on:click={() => ($locationQuery = location.name)}>
			{location.name}
		</a>
		<br />
	{:else}
		{#if $locationQuery}
			"{$locationQuery}" not found
		{/if}
	{/each}
</Box>
