<script lang="ts">
	import Box from '$lib/Box.svelte';
	import RouteTimeline from '$lib/RouteTimeline.svelte';
	import type { route } from '$lib/types';
	import { destinationQuery, originQuery, routes } from '$lib/stores';
	import { getArriveTimeHTML, getDurationHTML } from '$lib/utilities';

	async function getDirections(
		{ latitude: fromLat, longitude: fromLon },
		{ latitude: toLat, longitude: toLon }
	) {
		const fromQuery = `from=${fromLat},${fromLon}`;
		const toQuery = `to=${toLat},${toLon}`;
		const res = await fetch(`/api/directions?${fromQuery}&${toQuery}`);
		const data = await res.json();

		return data;
	}

	let directions: route[] | Promise<route[]> = $routes;
	if (!directions.length && $originQuery.name && $destinationQuery.name) {
		directions = getDirections($originQuery, $destinationQuery).then(
			(newDirections) => ($routes = newDirections)
		);
	}
</script>

<Box>
	{#if $originQuery.name && $destinationQuery.name}
		{#await directions}
			Calculating directions...
		{:then response}
			<div class="timelines">
				{#each response as route}
					<RouteTimeline
						{route}
						longestRoute={response.reduce((a, b) => (a > b.distance ? a : b.distance), 0)}
					/>
					<!-- How long the route takes -->
					{@html getDurationHTML(route)}
					<!-- Extra information like walking and arrival time -->
					{@html getArriveTimeHTML(route)}
				{/each}
			</div>
		{:catch error}
			An error has occurred, please try again.
		{/await}
	{:else}
		enter location to search
	{/if}
</Box>

<style>
	.timelines {
		display: grid;
		column-gap: var(--space);
		grid-template-columns: 1fr auto;
		justify-content: space-between;
		align-items: center;
	}

	/* :global() to select elements inside {@html ...} tags */
	.timelines :global(.extra) {
		font-size: 0.8rem;
		grid-column: 1 / 3;
		margin: 3px 0 var(--space) 0;
	}

	.timelines :global(.time) {
		font-size: 1.1rem;
		text-align: right;
	}

	.timelines :global(.number) {
		font-weight: bolder;
	}
</style>
