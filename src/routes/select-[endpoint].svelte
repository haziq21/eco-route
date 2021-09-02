<script lang="ts">
	import { page } from '$app/stores';
	import Box from '$lib/Box.svelte';
	import { currentPlace, destinationQuery, originQuery } from './stores.js';

	async function getPlaces(search: string) {
		const res = await fetch('/api/places?search=' + search);
		const data = await res.json();

		return data;
	}

	let searchResults = [];

	// Select the active query
	const locationQuery = $page.params.endpoint === 'destination' ? destinationQuery : originQuery;
	$: getPlaces($locationQuery.name).then((result) => (searchResults = result.data));
</script>

<Box>
	{#if !$locationQuery.name}
		<a href="/suggested-routes" on:click={() => ($locationQuery = $currentPlace)}>
			Current location<br />
		</a>
	{/if}
	{#each searchResults as location}
		<a href="/suggested-routes" on:click={() => ($locationQuery = location)}>
			{location.name}
		</a>
		<br />
	{:else}
		{#if $locationQuery.name}
			"{$locationQuery.name}" not found
		{/if}
	{/each}
</Box>
