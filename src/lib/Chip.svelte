<script>
	export let icon;
</script>

<span class="chip">
	<span class="material-icons"> {icon} </span>
	<span class="slot">
		<slot />
	</span>
</span>

<style>
	.material-icons {
		color: var(--input-field);
		margin-right: var(--space-sm);
	}
	.chip {
		/* height: min-content; */
		padding: var(--space-sm) var(--space);
		margin-right: var(--space);
		background-color: var(--icon-text);
		border-radius: var(--border-radius-sm);
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
