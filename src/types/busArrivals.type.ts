export type bus = {
	minutesToArrival: number;
	// occupancy: number;
	// wheelchairAccessible: boolean
};

export type service = {
	number: number;
	arrivals: bus[];
};

export type arrivals = {
	busStopCode: string;
	services: service[];
};
