<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import Box from '$lib/Box.svelte';
	import { currentPlace, destinationQuery, originQuery, routes } from '$lib/stores';

	async function getPlaces(search: string) {
		const res = await fetch('/api/places?search=' + search);
		const data = await res.json();

		return data;
	}

	let searchResults = [];

	// Clear the routes store
	$routes = [];

	// Select the active query
	const locationQuery = $page.params.endpoint === 'destination' ? destinationQuery : originQuery;
	const oppositeQuery = $page.params.endpoint === 'destination' ? originQuery : destinationQuery;
	$: getPlaces($locationQuery.name).then((result) => (searchResults = result));

	$: if (
		$oppositeQuery.name !== 'Current location' &&
		!$locationQuery.name &&
		(!searchResults.length || searchResults[0].name !== 'Current location')
	) {
		searchResults = [$currentPlace, ...searchResults];
	}
</script>

<Box>
	{#each searchResults as location}
		<a href="/suggested-routes" on:click={() => ($locationQuery = location)}>
			{location.name}
		</a>
		<br />
	{:else}
		{#if $locationQuery.name}
			"{$locationQuery.name}" not found
		{:else}
			type a location to search
		{/if}
	{/each}
</Box>

<style>
	a {
		white-space: nowrap;
		overflow: hidden;
	}
</style>
