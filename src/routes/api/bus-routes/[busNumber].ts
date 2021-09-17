import type { rawBusRoutePoint, busRoutes } from '$lib/types';
import { DATAMALL_KEY } from '$lib/env';
import fs from 'fs';

// This takes about 10 seconds (51 recursions)
async function fetchRawData(iteration = 0) {
	// DataMall API URL
	const dataMallUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BusRoutes';

	// Send HTTP request
	const res = await fetch(`${dataMallUrl}?$skip=${iteration * 500}`, {
		headers: {
			AccountKey: DATAMALL_KEY
		}
	});
	let data: rawBusRoutePoint[] = (await res.json()).value;

	// Recurse to retrieve more data
	if (data.length >= 500) {
		const newData = await fetchRawData((iteration = iteration + 1));
		data = data.concat(newData);
	}

	// Return full data
	return data;
}

export async function get({ params, query }) {
	// Create busRoutes.json if it has not yet been created
	if (!fs.existsSync('busRoutes.json')) {
		const data = await fetchRawData();
		const formattedData = formatBusRoutes(data);

		// I don't know where busRoutes.json gets created
		fs.writeFileSync('busRoutes.json', JSON.stringify(formattedData));
	}

	// Retrieve data
	try {
		const dataString = fs.readFileSync('busRoutes.json', 'utf8');
		const data: busRoutes = JSON.parse(dataString);

		// Filter bus routes by service number and route direction
		return { body: data[params.busNumber][`direction${query.get('direction')}`] };
	} catch (err) {
		console.log(err);
		return;
	}
}

function formatBusRoutes(busRoutes: rawBusRoutePoint[]): busRoutes {
	const formattedBusRoutes: busRoutes = {};

	for (let i = 0; i < busRoutes.length; i++) {
		const serviceNumber = busRoutes[i].ServiceNo;
		const routeDirection = `direction${busRoutes[i].Direction}`;
		const stopCode = busRoutes[i].BusStopCode;

		// Initialise empty bus route if needed
		if (!(serviceNumber in formattedBusRoutes)) {
			formattedBusRoutes[serviceNumber] = { direction1: [], direction2: [] };
		}

		// Add this bus stop code to the list
		formattedBusRoutes[serviceNumber][routeDirection].push(stopCode);
	}

	return formattedBusRoutes;
}
