import type { place, rawPlace, rawPlacesRoot } from 'src/types/places.type';

export async function get({ query }) {
	if (!query.get('search')) {
		return { body: [] };
	}
	// API url and query paramaters
	const url = `https://developers.onemap.sg/commonapi/search`;
	const queryParams = [`searchVal=${query.get('search')}`, 'getAddrDetails=Y', 'returnGeom=Y'].join(
		'&'
	);

	const res = await fetch(`${url}?${queryParams}`);
	const data: rawPlacesRoot = await res.json();

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

function uniq(places: place[]): place[] {
	const seen = {};
	return places.filter(({ name }) => {
		const hasSeen = seen.hasOwnProperty(name);
		if (!hasSeen) seen[name] = true;
		return !hasSeen;
	});
}
