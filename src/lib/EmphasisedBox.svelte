<div class="box">
	<slot />
</div>

<style>
	.box {
		background-color: var(--header);
		color: var(--overlay);
		box-shadow: var(--shadow);
		border-radius: var(--border-radius);
		padding: var(--space);
		margin-bottom: var(--space);
	}
</style>
