<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { getPlaces } from '$lib/api';
	import Box from '$lib/Box.svelte';
	import { currentPlace, destinationQuery, originQuery } from '$lib/stores';
	import type { place } from '$lib/types';

	let searchResults: place[] = [];

	// Select the active query
	const locationQuery = $page.params.endpoint === 'destination' ? destinationQuery : originQuery;
	const oppositeQuery = $page.params.endpoint === 'destination' ? originQuery : destinationQuery;
	$: if ($locationQuery.name)
		getPlaces($locationQuery.name).then((result) => (searchResults = result));

	$: if (
		$currentPlace.hasPermission &&
		$oppositeQuery.name !== $currentPlace.name &&
		!$locationQuery.name &&
		(!searchResults.length || searchResults[0].name !== 'Current location')
	) {
		searchResults = [$currentPlace, ...searchResults];
	}
</script>

<Box>
	<ul>
		{#if $locationQuery.name}
			{#each searchResults as location}
				<li on:click={() => ($locationQuery = location)}>
					<a href="/suggested-routes">{location.name}</a>
				</li>
			{:else}
				"{$locationQuery.name}" not found
			{/each}
		{:else if $oppositeQuery.name !== $currentPlace.name}
			<li on:click={() => ($locationQuery = $currentPlace)}>
				<a href="/suggested-routes">{$currentPlace.name}</a>
			</li>
		{:else}
			enter a location to search
		{/if}
	</ul>
</Box>

<style>
	ul {
		position: relative;
		list-style: none;
		padding: 0;
		margin: 0;
		white-space: nowrap;
	}
</style>
