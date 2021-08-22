import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'public',
			assets: 'public',
			fallback: 'index.html'
		}),
		ssr: false,
		files: {
			template: 'src/index.html'
		},
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
