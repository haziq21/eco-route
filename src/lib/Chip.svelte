<script lang="ts">
	import { goto } from '$app/navigation';
	import { getPlaceFromStorage } from '$lib/utilities';
	import { destinationQuery } from './stores';

	export let icon: string;
	export let name: string;
	let pressTimer;

	function startLongPress() {
		pressTimer = setTimeout(() => goto(`/set-${name}`), 1000);
	}

	function endLongPress() {
		clearTimeout(pressTimer);
	}

	function redirect() {
		const place = getPlaceFromStorage(name);
		if (place) {
			$destinationQuery = place;
			goto('/suggested-routes');
		} else goto(`/set-${name}`);
	}
</script>

<span
	class="chip"
	class:unused={!getPlaceFromStorage(name)}
	on:click={redirect}
	on:pointerdown={startLongPress}
	on:pointerup={endLongPress}
>
	<span class="material-icons"> {icon} </span>
	<slot />
</span>

<style>
	.material-icons {
		margin-right: var(--space-sm);
	}

	.chip {
		display: flex;
		flex-direction: row;
		align-items: center;

		padding: var(--space-sm) var(--space);
		margin-right: var(--space);
		background-color: var(--icon-text);
		border-radius: var(--border-radius-sm);
	}

	.unused {
		color: rgb(167, 247, 199);
	}
</style>
