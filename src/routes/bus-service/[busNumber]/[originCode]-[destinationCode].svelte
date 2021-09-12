<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { getBusRoute } from '$lib/api';
	import Box from '$lib/Box.svelte';

	let serviceNumber = $page.params.busNumber;
</script>

<Box>
	{#await getBusRoute(serviceNumber)}
		Loading bus route...
	{:then busStops}
		<ol>
			{#each busStops as stop}
				<li><a href="/bus-stop/{stop.code}/{stop.name}">{stop.name}</a></li>
			{/each}
		</ol>
	{/await}
</Box>
