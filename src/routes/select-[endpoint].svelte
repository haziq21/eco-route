<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import Box from '$lib/Box.svelte';
	import { currentPlace, destinationQuery, originQuery, routes } from '$lib/stores';

	async function getPlaces(search: string) {
		const res = await fetch('/api/places/' + search);
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
	{#if $locationQuery.name}
		<ul>
			{#each searchResults as location}
				<li on:click={() => ($locationQuery = location)}>
					<a href="/suggested-routes">{location.name}</a>
				</li>
			{:else}
				"{$locationQuery.name}" not found
			{/each}
		</ul>
	{:else}
		type a location to search
	{/if}
</Box>

<style>
	ul {
		position: relative;
		list-style: none;
		padding: 0;
		margin: 0;
		white-space: nowrap;
	}

	/* ul::before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-shadow: inset -14px 0 black;
	} */
</style>
