<script lang="ts">
	import { page } from '$app/stores';
	import { getBusRoute } from '$lib/utilities';
	import Box from '$lib/Box.svelte';

	let serviceNumber = $page.params.busNumber;
</script>

<Box>
	{#await getBusRoute(serviceNumber)}
		Loading bus route...
	{:then busStops}
		<ol>
			{#each busStops as stop}
				<li>
					<a href="/bus-stop/{stop.code}/{stop.name}">
						<h2>{stop.name}</h2>
						<span class="stop-code">{stop.code}</span>
					</a>
				</li>
			{/each}
		</ol>
	{/await}
</Box>

<style>
	h2 {
		margin: 0;
		padding: 0;
		font-size: 1rem;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style-type: none;
	}
</style>
