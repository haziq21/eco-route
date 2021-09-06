import type { busStop, rawBusStop } from 'src/types/busStops.type';
import { config } from './_config.js';

export async function get() {
	const data = (await fetchData()).map((x) => formatBusStop(x));

	if (data) {
		return {
			body: {
				data
			}
		};
	}
}

async function fetchData(iteration = 0) {
	// DataMall bus stops API
	const url = 'http://datamall2.mytransport.sg/ltaodataservice/BusStops';
	const skipParam = '?$skip=' + iteration * 500;

	// HTTP request
	const res = await fetch(url + skipParam, {
		headers: {
			AccountKey: config.DATAMALL_KEY
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
		code: data.BusStopCode
	};
}
