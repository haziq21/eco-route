<script lang="ts">
	import { page } from '$app/stores';
	import { getBusStop, getBusArrivals } from '$lib/api';
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import type { arrivals } from '$lib/types';

	let arrivals: arrivals;
	getBusStop($page.params.busStopCode)
		.then((res) => getBusArrivals(res))
		.then((res) => (arrivals = res));
</script>

<Box>
	{#if !arrivals}
		<p>Loading bus arrivals...</p>
	{:else}
		<BusArrivals {arrivals} showHeader={false} />
	{/if}
</Box>
