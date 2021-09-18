<script lang="ts">
	import { locationChipSearch } from '$lib/stores';

	export let colour: 'overlay' | 'icon-text' = 'overlay';

	// Perform extra actions on back button navigation
	// (e.g. clearing a search bar)
	export let extraActions = () => {
		$locationChipSearch = '';
	};

	window.onpopstate = extraActions;
</script>

<!-- on:click={history.back} throws "'back' called on 
	an object that does not implement interface History" -->
<span
	on:click={() => history.back()}
	class="material-icons back-button"
	style="color: var(--{colour})"
>
	arrow_back_ios
</span>

<style>
	.back-button {
		padding: 6px 0;
		cursor: pointer;
	}
</style>
