<script lang="ts">
	import { page } from '$app/stores';
	import { getBusStop, getBusArrivals } from '$lib/utilities';
	import Box from '$lib/Box.svelte';
	import BusArrivals from '$lib/BusArrivals.svelte';
	import { busStopArrivals } from '$lib/stores';

	$busStopArrivals = getBusStop($page.params.busStopCode).then((res) => getBusArrivals(res));
</script>

<Box>
	{#await $busStopArrivals}
		<p>Loading bus arrivals...</p>
	{:then res}
		<BusArrivals arrivals={res} showHeader={false} />
	{/await}
</Box>
