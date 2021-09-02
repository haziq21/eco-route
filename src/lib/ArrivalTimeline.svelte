<script lang="ts">
	import type { bus } from 'src/types/busArrivals.type';
	import ArrivalMarker from './ArrivalMarker.svelte';

	export let arrivals: bus[];
</script>

<div class="bus-service">
	{#each arrivals as arrival (arrival)}
		<ArrivalMarker {arrival} />
		{#if arrival !== arrivals[arrivals.length - 1]}
			<span class="separator">&lt;</span>
		{/if}
	{/each}
</div>

<style>
	.bus-service {
		/* background-color: blue; */
		width: fit-content;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		/* margin-right: auto; */
	}

	.separator {
		padding: 0 var(--space);
	}
</style>
