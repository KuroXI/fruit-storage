import mongoose from "mongoose";
import { mongoDatabaseConfig } from "../../../config";

(async () => {
	try {
		await mongoose.connect(mongoDatabaseConfig.connectionString, mongoDatabaseConfig.config);
		console.log("[DATABASE] Connected to the database");
	} catch (error) {
		console.error("[DATABASE] Connection Error: ", error);
		process.exit(1);
	}
})();
