<script lang="ts">
	import Box from '$lib/Box.svelte';
	import type { place } from 'src/types/places.type';
	import { destinationQuery, originQuery } from './stores.js';

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
</script>

<Box>
	<a href="/route-details">this is a suggested route</a>
	{#await getDirections($originQuery, $destinationQuery)}
		loading...
	{:then response}
		response: {JSON.stringify(response.data)}
	{:catch error}
		Error: {error.message}
	{/await}
</Box>
