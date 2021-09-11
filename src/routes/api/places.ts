import type { place, rawPlace } from '$lib/types';

export async function get({ query }: { query: URLSearchParams }): Promise<{ body: place[] }> {
	if (!query.get('search')) {
		return { body: [] };
	}
	// API url and query paramaters
	const url = `https://developers.onemap.sg/commonapi/search`;
	const queryParams = [`searchVal=${query.get('search')}`, 'getAddrDetails=Y', 'returnGeom=Y'].join(
		'&'
	);

	const res = await fetch(`${url}?${queryParams}`);
	const data = await res.json();

	return {
		body: uniq(data.results.map(formatPlace))
	};
}

function formatPlace(data: rawPlace): place {
	return {
		name: data.SEARCHVAL,
		address: data.BLK_NO + ' ' + data.ROAD_NAME,
		longitude: parseFloat(data.LONGITUDE),
		latitude: parseFloat(data.LATITUDE)
	};
}

// Returns unique places (sometimes with housing estates OneMap returns
// multiple addresses for multiple units within the estate, but we don't need this)
function uniq(places: place[]): place[] {
	const seen = {};
	return places.filter(({ name }) => {
		const hasSeen = seen.hasOwnProperty(name);
		if (!hasSeen) seen[name] = true;
		return !hasSeen;
	});
}
