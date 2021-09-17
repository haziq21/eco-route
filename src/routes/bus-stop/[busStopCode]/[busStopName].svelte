<script lang="ts">
	import { page } from '$app/stores';
	import { getBusStop, getBusArrivals } from '$lib/utilities';
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';

	let arrivals = getBusStop($page.params.busStopCode).then((res) => getBusArrivals(res));
</script>

<Box>
	{#await arrivals}
		<p>Loading bus arrivals...</p>
	{:then res}
		<BusArrivals arrivals={res} showHeader={false} />
	{/await}
</Box>
