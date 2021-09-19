<div id="box">
	<slot />
</div>

<style>
	#box {
		position: relative;
		background-color: var(--overlay);
		color: var(--text);
		box-shadow: var(--shadow);
		border-radius: var(--border-radius);
		padding: var(--space);
		margin-bottom: var(--space);
		overflow: hidden;
		z-index: 1;
	}
</style>
