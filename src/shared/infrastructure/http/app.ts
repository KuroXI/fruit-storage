import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import Fastify from "fastify";
import { connectDatabase } from "../database";
import schema from "./graphql/schema";

(async () => {
	const fastify = Fastify({ logger: true });

	const apollo = new ApolloServer({
		schema: schema,
		plugins: [fastifyApolloDrainPlugin(fastify)],
	});

	await connectDatabase();

	await apollo.start();

	await fastify.register(fastifyApollo(apollo));

	fastify.listen({ port: Number(process.env.PORT) || 8080 }, (error) => {
		if (error) throw error;
	});
})();
