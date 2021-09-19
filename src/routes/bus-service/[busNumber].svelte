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
		<div class="route">
			{#each busStops as stop}
				<a href="/bus-stop/{stop.code}">
					<h2>{stop.name}</h2>
					<span class="stop-code">{stop.code}</span>
				</a>
				<span class="segment" />
			{/each}
		</div>
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

	.route {
		display: flex;
		flex-direction: column;
		padding: var(--space) 0;
	}

	.route > a {
		display: flex;
		flex-direction: column;
		justify-content: center;

		height: 5px;
		padding-left: calc(var(--space) * 2);
	}

	.segment {
		position: relative;
		width: var(--space);
		height: 60px;
	}

	.segment::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		height: 100%;
		width: 51%;
		background: var(--header);
		transform: skew(0deg, 30deg);
	}

	.segment::after {
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		height: 100%;
		width: 50%;
		background: var(--header);
		transform: skew(0deg, -30deg);
	}

	/* Hide the last segment */
	.segment:last-child {
		display: none;
	}
</style>
