<script lang="ts">
	import type { arrivals, bus } from 'src/types/busArrivals.type';

	export let arrival: bus;
</script>

<span class="info" style="left: {arrival.minutesToArrival * 4}%">
	<span class="time">
		{arrival.minutesToArrival}
	</span>
	<span class="bus-type">SD</span>
	<span class="marker" />
</span>

<style>
	.marker {
		width: 10px;
		height: 10px;
		background-color: var(--overlay);
		border-radius: 100%;
		border-style: solid;
		border-width: 3px;
		border-color: var(--background);
		grid-area: marker;
	}

	.bus-type {
		grid-area: bus-type;
	}

	.info {
		position: absolute;
		/* background-color: aqua; */
		display: grid;
		grid-template-columns: min-content min-content;
		grid-template-rows: auto;
		grid-template-areas: 'time bus-type' 'marker marker';
		justify-items: center;
		transform: translateX(-50%);
		/* transform: translateX(0%); */
		z-index: 1;
	}
</style>
