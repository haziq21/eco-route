const prefix = process.env.NODE_ENV === 'production' ? process.env : import.meta.env;

export const DATAMALL_KEY: string = prefix.VITE_DATAMALL_KEY;
export const ONEMAP_CREDENTIALS: string = JSON.stringify({
	email: prefix.VITE_ONEMAP_EMAIL,
	password: prefix.VITE_ONEMAP_PASSWORD
});
