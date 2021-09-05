<script lang="ts">
	import Box from '$lib/Box.svelte';
	import RouteTimeline from '$lib/RouteTimeline.svelte';
	import type { route } from 'src/types/directions.type.js';
	import type { place } from 'src/types/places.type';
	import { destinationQuery, originQuery, routes } from './_stores';

	function hours(seconds: number) {
		return Math.floor(seconds / 3600);
	}

	function minutes(seconds: number) {
		return Math.floor((seconds - hours(seconds) * 3600) / 60);
	}

	async function getDirections(
		{ latitude: fromLat, longitude: fromLon }: place,
		{ latitude: toLat, longitude: toLon }: place
	) {
		const fromQuery = `${fromLat},${fromLon}`;
		const toQuery = `${toLat},${toLon}`;
		const res = await fetch(`/api/directions?from=${fromQuery}&to=${toQuery}`);
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
			loading...
		{:then response}
			<div class="timelines">
				{#each response as route}
					<RouteTimeline
						{route}
						longestRoute={response.reduce((a, b) => (a > (b = b.distance) ? a : b), 0)}
					/>

					<!-- How long the route takes -->
					<span class="time">
						{#if hours(route.duration)}
							<span class="number">{hours(route.duration)}</span>
							hr
						{/if}
						<span class="number">{minutes(route.duration)}</span>
						min
					</span>

					<!-- Extra information like walking and arrival time -->
					<span class="extra">
						Leave now, arrive at
						<span class="number"
							>{new Date(route.arriveTime).toLocaleString('en', {
								hour: 'numeric',
								minute: 'numeric'
							})}</span
						>.
						<span class="number">{Math.round(route.walkTime / 60)}</span> min walking time.
					</span>
				{/each}
			</div>
		{:catch error}
			Error: {error.message}
		{/await}
	{:else}
		enter location to search
	{/if}
</Box>

<style>
	.extra {
		font-size: 0.8em;
		grid-column: 1 / 3;
		margin: 3px 0 var(--space) 0;
	}

	.timelines {
		display: grid;
		column-gap: var(--space);
		grid-template-columns: 1fr auto;
		justify-content: space-between;
		align-items: center;
	}

	.time {
		font-size: 1.1em;
		text-align: right;
	}

	.number {
		font-weight: bolder;
	}
</style>
