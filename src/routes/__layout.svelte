<script lang="ts">
	import EmphasisedBox from '$lib/EmphasisedBox.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { destinationQuery, originQuery } from './stores.js';
</script>

<EmphasisedBox>
	<!-- "Go somewhere" homepage header -->
	{#if $page.path === '/'}
		<span class="header-layout" transition:slide>
			<h1 transition:fade>Go somewhere</h1>
		</span>
	{/if}

	<div class="header-layout">
		<!-- Back button -->
		<div class="back-button-layout">
			<!-- Hide back button on homepage -->
			{#if $page.path !== '/'}
				<a
					href={$page.path !== '/route-details' ? '/' : '/suggested-routes'}
					class="material-icons"
				>
					arrow_back_ios
				</a>
			{/if}
		</div>

		<!-- Don't show searchbars on route details page -->
		{#if $page.path !== '/route-details'}
			<div class="searchbar-layout">
				<!-- Origin searchbar -->
				{#if $page.path === '/suggested-routes' || $page.params.endpoint == 'origin'}
					<Searchbar placeholder="Enter your origin" bind:text={$originQuery.name} name="origin" />
				{/if}
				<!-- Destination searchbar -->
				{#if $page.params.endpoint !== 'origin'}
					<Searchbar
						placeholder="Enter your destination"
						bind:text={$destinationQuery.name}
						name="destination"
					/>
				{/if}
			</div>
		{:else}
			route summary goes here
		{/if}
	</div>
</EmphasisedBox>

<slot />

<style>
	.searchbar-layout {
		width: 100%;
		display: grid;
		gap: var(--space-sm);
	}

	.header-layout {
		display: flex;
		flex-direction: row;
	}

	.back-button-layout {
		padding-top: 9px;
	}
</style>
