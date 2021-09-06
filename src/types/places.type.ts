export interface place {
	name: string;
	address: string;
	longitude: number;
	latitude: number;
}

export interface rawPlacesRoot {
	results: rawPlace[];
}

export interface rawPlace {
	SEARCHVAL: string;
	BLK_NO: string;
	ROAD_NAME: string;
	LATITUDE: string;
	LONGITUDE: string;
}
