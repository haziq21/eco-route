<script lang="ts">
	import { page } from '$app/stores';
	import { getBusRoute } from '$lib/utilities';
	import Box from '$lib/Box.svelte';
	import { serviceRoute } from '$lib/stores';

	$serviceRoute = getBusRoute($page.params.busNumber);
</script>

<Box>
	{#await $serviceRoute}
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
	.stop-code {
		font-size: 0.9rem;
	}

	h2 {
		margin: 0;
		padding: 0;
		font-size: 1rem;
	}

	ol {
		margin: -18px 0;
		padding: 0;
		list-style-type: none;
	}

	li {
		margin: 18px 0;
	}
</style>
