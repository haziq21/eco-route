<script>
	import EmphasisedBox from '$lib/EmphasisedBox.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let destinationSearchbar;

	function searchbarRedirect() {
		if ($page.path !== '/select-location') {
			goto('/select-location');
			setTimeout(() => destinationSearchbar.focus(), 150);
		}
	}
</script>

<EmphasisedBox>
	<!-- "Go somewhere" homepage header -->
	{#if $page.path === '/'}
		<span class="searchbar-layout" transition:slide>
			<h1 transition:fade>Go somewhere</h1>
		</span>
	{/if}

	<div class="header-layout">
		<!-- Back button -->
		<div class="back-button-layout">
			{#if $page.path !== '/'}
				<a href="/" class="material-icons">arrow_back_ios</a>
			{/if}
		</div>

		<div class="searchbar-layout">
			<!-- Origin searchbar -->
			{#if $page.path === '/suggested-routes'}
				<Searchbar placeholder="Enter your origin" defaultText="Current location" />
			{/if}
			<!-- Destination searchbar -->
			<Searchbar
				placeholder="Enter your destination"
				bind:ref={destinationSearchbar}
				on:click={searchbarRedirect}
			/>
		</div>
	</div>
</EmphasisedBox>

<slot />

<style>
	.searchbar-layout {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.header-layout {
		display: flex;
		flex-direction: row;
	}

	.back-button-layout {
		padding-top: 9px;
	}
</style>
