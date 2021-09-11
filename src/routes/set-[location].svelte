<script context="module">
	// This component needs to access localStorage (client-side)
	export const ssr = false;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getPlaces } from '$lib/api';
	import Box from '$lib/Box.svelte';
	import { destinationQuery } from '$lib/stores';
	import { locationChipSearch } from './__layout.svelte';
	import type { place } from '$lib/types';

	let searchResults: place[] = [];

	$: getPlaces($locationChipSearch).then((result) => (searchResults = result));

	function setLocation(location: place) {
		// Save the set location
		localStorage.setItem(`${$page.params.location}`, JSON.stringify(location));

		// Find directions to that location
		$destinationQuery = location;
		$locationChipSearch = '';
		goto('/suggested-routes');
	}
</script>

<Box>
	{#if $locationChipSearch}
		<ul>
			{#each searchResults as location}
				<li on:click={() => setLocation(location)}>
					<!-- <a href="/suggested-routes"> -->
					{location.name}
					<!-- </a> -->
				</li>
			{:else}
				"{$locationChipSearch}" not found
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
