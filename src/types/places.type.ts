export interface place {
	name: string;
	address: string;
	longitude: number;
	latitude: number;
}

export interface rawPlacesRoot {
	features: rawPlace[];
}

export interface rawPlace {
	text: string;
	properties: {
		address: string;
	};
	center: [number, number];
}
