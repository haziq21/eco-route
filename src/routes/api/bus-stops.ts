import { DATAMALL_KEY } from '$lib/env';
import type { busStop, rawBusStop } from 'src/types/busStops.type';

export async function get() {
	return {
		body: (await fetchData()).map(formatBusStop)
	};
}

async function fetchData(iteration = 0) {
	// DataMall bus stops API
	const url = 'http://datamall2.mytransport.sg/ltaodataservice/BusStops';

	// HTTP request
	const res = await fetch(`${url}?$skip=${iteration * 500}`, {
		headers: {
			AccountKey: DATAMALL_KEY
		}
	});
	let data: rawBusStop[] = (await res.json()).value;

	// Recurse to retrieve more data
	if (data.length) {
		const newData = await fetchData((iteration = iteration + 1));
		data = data.concat(newData);
	}

	// Return formatted data
	return data;
}

function formatBusStop(data: rawBusStop): busStop {
	return {
		name: data.Description,
		code: data.BusStopCode,
		latitude: data.Latitude,
		longitude: data.Longitude
	};
}
