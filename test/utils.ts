import type { Mongoose } from "mongoose";
import mongoose from "mongoose";
import { mongoDatabaseConfig } from "../src/config";

let dbConnection: Mongoose | null = null;

export async function connectToDatabase() {
	dbConnection = await mongoose.connect(
		mongoDatabaseConfig.connectionString,
		mongoDatabaseConfig.config,
	);
}

export function getDatabaseConnection() {
	if (!dbConnection) {
		throw new Error("Database connection has not been established.");
	}

	return dbConnection;
}

export async function closeConnection() {
	await getDatabaseConnection().connection.close();
}

export async function dropAllCollection() {
	const collections = await getDatabaseConnection().connection.db.collections();
	for (const collection of collections) {
		await collection.drop();
	}
}
