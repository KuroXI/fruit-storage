import "jest";

import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { findFruitQuery } from "../query";
import { seedFruitForFruitStorage } from "../seed/seedFruitForFruitStorage";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

const seed = {
	name: "lemon",
	description: "this is a lemon",
	limit: 10,
	amount: 0,
};

describe("Find Fruit Tests", () => {
	beforeAll(async () => {
		await connectToDatabase();
		await dropAllCollection();
		await seedFruitForFruitStorage(seed);
	});

	afterEach(async () => {
		await dropAllCollection();
		await seedFruitForFruitStorage(seed);
	});

	afterAll(async () => await closeConnection());

	const apollo = new ApolloServer({ schema: schema });

	it("should return the details of the fruit when queried by name", async () => {
		const result = await apollo.executeOperation({
			query: findFruitQuery,
			variables: {
				name: "lemon",
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.findFruit).toBeTruthy();
		expect(data.findFruit.fruit.name).toBe("lemon");
	});

	it("should return an error when the fruit is not found", async () => {
		const result = await apollo.executeOperation({
			query: findFruitQuery,
			variables: {
				name: "not a lemon",
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe("The fruit name 'not a lemon' does not exist!");
		expect(data.findFruit).toBe(null);
	});
});
