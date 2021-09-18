<script lang="ts">
	import { locationChipSearch } from '$lib/stores';

	export let colour: 'overlay' | 'icon-text' = 'overlay';
	export let action = undefined;

	// Go back to the previous page
	function back() {
		history.back();
		$locationChipSearch = '';
		if (action) action();
	}
</script>

<span on:click={back} class="material-icons back-button" style="color: var(--{colour})">
	arrow_back_ios
</span>

<style>
	.back-button {
		padding: 6px 0;
		cursor: pointer;
	}
</style>
