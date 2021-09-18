<script lang="ts">
	import { page } from '$app/stores';
	import Box from '$lib/Box.svelte';
	import { uncompressJSON } from '$lib/utilities';
	import { fly } from 'svelte/transition';
	import type { route } from '$lib/types';

	let route: route = uncompressJSON($page.params.route);
</script>

<Box>
	<div class="timeline">
		{#each route.segments as segment}
			<div class="place">
				<span>{segment.startLocation}</span>
			</div>
			<div class="segment {segment.mode} {segment.modeIdentity}">
				<span class="transport-mode">
					{#if segment.mode === 'walk'}
						Walk for {Math.round(segment.distance)} metres
					{:else}
						<span class="mode-label {segment.mode} {segment.modeIdentity}">
							{segment.modeIdentity}
						</span>
						for {segment.intermediateStops} stops
					{/if}
					({Math.round(segment.duration / 60)} min)
				</span>
			</div>
		{/each}
		<div class="place">
			<span class="place-name">Destination</span>
		</div>
	</div>
</Box>

<style>
	.timeline {
		display: flex;
		flex-direction: column;
		padding: var(--space) 0;
	}

	.segment {
		position: relative;
		width: var(--space);
		height: 100px;
		border-radius: 3px;
	}

	.transport-mode {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		padding-left: 30px;
		width: max-content;
	}

	.mode-label {
		color: rgba(0, 0, 0, 0.4);
		padding: 3px 6px;
		margin-right: 3px;
		border-radius: 6px;
		font-weight: bolder;
	}

	.mode-label.bus {
		color: var(--overlay);
	}

	.place {
		position: relative;
		height: var(--space-sm);
		padding-left: 30px;
	}

	.place > * {
		position: absolute;
		top: 0;
		transform: translateY(-50%);
		font-size: 1.1rem;
		font-weight: bolder;
	}
</style>
