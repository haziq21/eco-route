<script>
	import EmphasisedBox from '$lib/EmphasisedBox.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import { page } from '$app/stores';
</script>

<EmphasisedBox>
	<!-- "Go somewhere" homepage header -->
	{#if $page.path == '/'}
		<h1>Go somewhere</h1>
	{/if}

	<!-- Destination searchbar -->
	<Searchbar placeholder="Enter your destination" />
</EmphasisedBox>
