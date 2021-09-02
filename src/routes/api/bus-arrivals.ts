import type {
	arrivals,
	bus,
	rawArrivals,
	rawBus,
	rawService,
	service
} from 'src/types/busArrivals.type';

export async function get() {
	// DataMall API URL
	const dataMallUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2';
	const stopCodeParam = '?BusStopCode=19049';

	// Send HTTP request
	const res = await fetch(dataMallUrl + stopCodeParam, {
		headers: {
			AccountKey: 'cmWAPZxsRe+1Dahcw+wBVQ=='
		}
	});

	// Convert HTTP response to JSON and restructure JSON data
	const data = formatArrivals(await res.json());

	if (data) {
		return {
			body: {
				data
			}
		};
	}
}

function formatArrivals(data: rawArrivals): arrivals {
	// Some bus numbers / codes have letters as well as numbers,
	// so here we're sorting by number first then by letter.
	function busNumberSort(bus1: service, bus2: service) {
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
			.map((x) => formatService(x))
			// Sort by bus number
			.sort(busNumberSort)
	};
}

function formatService(data: rawService): service {
	return {
		number: data.ServiceNo,
		arrivals: [formatBus(data.NextBus), formatBus(data.NextBus2)].filter(
			(x) => x !== null // Filter out unavailable data
		)
	};
}

function formatBus(data: rawBus): bus {
	// Data not available
	if (!data.EstimatedArrival) {
		return null;
	}
	return {
		minutesToArrival: Math.floor(
			Math.max(new Date(data.EstimatedArrival).getTime() - Date.now(), 0) / 60000 // 60,000 miliseconds in a minute
		),
		wheelchairAccessible: data.Feature == 'WAB',
		type: data.Type
	};
}
