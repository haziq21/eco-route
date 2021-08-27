<script lang="ts">
	import type { bus } from 'src/types/busArrivals.type';
	import ArrivalMarker from './ArrivalMarker.svelte';

	export let arrivals: bus[];
</script>

<div class="bus-service">
	<!-- Horizontal timeline line -->
	<div class="line" />

	{#each arrivals as arrival}
		{#if arrival.minutesToArrival < 25}
			<ArrivalMarker {arrival} />
		{/if}
	{/each}
</div>

<style>
	.bus-service {
		position: relative;
		/* display: flex;
		flex-direction: row;
		align-items: flex-end; */
	}

	.line {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 3px;
		margin: 0;
		border-radius: 1.5px;
		background-color: var(--background);
	}
</style>
