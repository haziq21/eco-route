import { DATAMALL_KEY } from '$lib/env';
import { sortBusNumbers } from '$lib/utilities';
import type {
	rawBusArrival,
	rawBusStopArrivals,
	rawServiceArrivals,
	busArrival,
	serviceArrivals,
	namelessBusStopArrivals
} from '$lib/types';

export async function get({ params }) {
	// DataMall API URL
	const dataMallUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2';

	// Send HTTP request
	const res = await fetch(`${dataMallUrl}?BusStopCode=${params.busStopCode}`, {
		headers: {
			AccountKey: DATAMALL_KEY
		}
	});

	// Convert HTTP response to JSON and restructure JSON data
	const data = formatArrivals(await res.json());

	return {
		body: data
	};
}

function formatArrivals(data: rawBusStopArrivals): namelessBusStopArrivals {
	return {
		busStopCode: data.BusStopCode,
		services: data.Services
			// Reformat JSON data
			.map(formatService)
			// Sort by bus number
			.sort(({ number: a }, { number: b }) => sortBusNumbers(a, b))
	};
}

function formatService(data: rawServiceArrivals): serviceArrivals {
	return {
		number: data.ServiceNo,
		arrivals: [formatBus(data.NextBus), formatBus(data.NextBus2)].filter(
			(x) => x !== null // Filter out unavailable data
		)
	};
}

function formatBus(data: rawBusArrival): busArrival {
	// Data not available
	if (!data.EstimatedArrival) {
		return null;
	}
	return {
		minutesToArrival: Math.floor(
			Math.max(new Date(data.EstimatedArrival).getTime() - Date.now(), 0) / 60000 // 60,000 miliseconds in a minute
		),
		occupancy: data.Load,
		wheelchairAccessible: data.Feature == 'WAB',
		type: data.Type
	};
}
