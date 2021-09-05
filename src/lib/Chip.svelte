<script>
	export let icon;
	export let redirect = undefined;
</script>

<a class="chip" href={redirect}>
	<span class="material-icons"> {icon} </span>
	<span class="slot">
		<slot />
	</span>
</a>

<style>
	a {
		text-decoration: none;
		color: unset;
	}
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
		/* box-shadow: var(--shadow); */
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
