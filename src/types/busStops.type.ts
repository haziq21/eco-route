export interface busStop {
	code: string;
	name: string;
	latitude: number;
	longitude: number;
}

export interface rawBusStop {
	BusStopCode: string;
	Description: string;
	Latitude: number;
	Longitude: number;
}
