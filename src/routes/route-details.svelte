<script lang="ts">
	import Box from '$lib/Box.svelte';
	import { selectedRoute } from './_stores';
</script>

<Box>
	<div class="timeline">
		{#each $selectedRoute.segments as segment}
			<div class="place">
				<span>{segment.startLocation}</span>
			</div>
			<div class="segment {segment.mode} {segment.modeIdentity}">
				<span class="transport-mode">
					{#if segment.mode === 'walk'}
						Walk for {Math.round(segment.distance)} metres
					{:else}
						<span class="mode-label {segment.mode} {segment.modeIdentity}"
							>{segment.modeIdentity}</span
						>
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

<div class="alarm-container">
	<span class="material-icons-outlined"> notifications </span>
	<span>Wake me up <br /> on interchanges</span>
</div>

<style>
	.alarm-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: fixed;
		bottom: 40px;
		right: 30px;
		padding: 6px 18px;
		border-radius: var(--border-radius);
		color: var(--overlay);
		background-color: var(--header);
		box-shadow: var(--shadow);
		font-size: 1em;
		/* font-weight: bold; */
	}

	.material-icons-outlined {
		font-size: 36px;
		margin-right: var(--space-md);
		margin-left: calc(-1 * var(--space-md));
	}

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
		background-color: var(--header);
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
		font-size: 1.1em;
		font-weight: bolder;
	}

	.walk {
		background-color: rgb(226, 226, 226);
	}

	.bus {
		background-color: rgb(45, 175, 105);
	}

	.mrt {
		/* Fallback colour, in case something
		goes wrong with the line names */
		background-color: rgb(3, 89, 173);
	}

	.EW {
		background-color: var(--MRT-EW);
	}

	.NS {
		background-color: var(--MRT-NS);
	}

	.CC {
		background-color: var(--MRT-CC);
	}

	.DT {
		background-color: var(--MRT-DT);
	}
</style>
