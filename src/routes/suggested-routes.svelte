<script lang="ts">
	import Box from '$lib/Box.svelte';
	import Route from '$lib/Route.svelte';
	import type { place } from 'src/types/places.type';
	import { destinationQuery, originQuery, routes } from './stores.js';

	function formatTime(seconds: number) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds - hours * 3600) / 60);

		if (hours) {
			return `${hours} hr ${minutes} min`;
		} else {
			return `${minutes} min`;
		}
	}

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

	// $routes = $routes.length ? $routes : getDirections($originQuery, $destinationQuery);
	let directions = $routes.length
		? $routes
		: getDirections($originQuery, $destinationQuery).then(
				(newDirections) => ($routes = newDirections)
		  );
</script>

<Box>
	{#await directions}
		loading...
	{:then response}
		<div class="timelines">
			{#each response as route}
				<Route
					{route}
					longestRoute={response.reduce((a, b) => (a > (b = b.distance) ? a : b), 0)}
				/>
				<span class="time">
					<!-- {formatTime(route.duration)} -->
					{#if hours(route.duration)}
						<span class="number">{hours(route.duration)}</span>
						hr
					{/if}
					<span class="number">{minutes(route.duration)}</span>
					min
				</span>
			{/each}
		</div>
	{:catch error}
		Error: {error.message}
	{/await}
</Box>

<style>
	.timelines {
		display: grid;
		gap: var(--space);
		grid-template-columns: 1fr auto;
		justify-content: space-between;
		align-items: center;
	}

	.number {
		font-weight: bolder;
	}
</style>
