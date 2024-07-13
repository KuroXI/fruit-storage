import type { ConnectOptions } from "mongoose";

const mongoDatabaseConfig = {
	connectionString: process.env.MONGODB_URL as string,
	config: {} as ConnectOptions,
};

export { mongoDatabaseConfig };
