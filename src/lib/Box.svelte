<script>
	export let title = undefined;
</script>

<div id="box">
	{#if title}
		<h1>{title}</h1>
	{/if}
	<slot />
</div>

<style>
	#box {
		background-color: var(--overlay);
		color: var(--text);
		box-shadow: var(--shadow);
		border-radius: var(--border-radius);
		padding: var(--space);
		margin-bottom: var(--space);
		overflow: hidden;
	}
</style>
