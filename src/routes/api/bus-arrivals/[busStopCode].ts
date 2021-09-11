import { DATAMALL_KEY } from '$lib/env';
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
	// Some bus numbers / codes have letters as well as numbers,
	// so here we're sorting by number first then by letter.
	function busNumberSort(bus1: serviceArrivals, bus2: serviceArrivals) {
		// Extract numbers from bus code
		const number1 = bus1.number.match(/\d+/g)[0];
		const number2 = bus2.number.match(/\d+/g)[0];

		// bus1 and bus2 don't have the same number
		// (e.g. 7A and 7B have the same number)
		if (number1 !== number2) {
			return parseInt(number1) - parseInt(number2);
		}

		// Sort alphabetically
		return bus1 > bus2 ? 1 : -1;
	}

	return {
		busStopCode: data.BusStopCode,
		services: data.Services
			// Reformat JSON data
			.map(formatService)
			// Sort by bus number
			.sort(busNumberSort)
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
