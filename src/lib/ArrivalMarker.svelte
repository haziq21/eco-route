<script lang="ts">
	import type { arrivals, bus } from 'src/types/busArrivals.type';

	export let arrival: bus;
</script>

<span class="info">
	<span class="number">
		{arrival.minutesToArrival}
	</span>
	<span class="time-unit">min</span>
	<span class="icons">
		<span>{arrival.type}</span>
	</span>
</span>

<style>
	.info {
		/* background-color: aqua; */
		display: grid;
		grid-template-columns: min-content min-content;
		grid-template-rows: auto;
		grid-template-areas: 'number icons' 'time-unit icons';
		justify-items: center;
		gap: 0 var(--space-sm);
	}

	.number {
		grid-area: number;
		font-weight: bolder;
		font-size: 1.17em;
	}

	.time-unit {
		grid-area: time-unit;
	}

	/* .marker {
		width: 10px;
		height: 10px;
		background-color: var(--overlay);
		border-radius: 100%;
		border-style: solid;
		border-width: 3px;
		border-color: var(--background);
		grid-area: marker;
	} */

	.icons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		grid-area: icons;
		vertical-align: center;
	}
</style>
