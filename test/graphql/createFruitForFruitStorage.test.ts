import "jest";

import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { createFruitForFruitStorageQuery } from "../query";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

describe("Fruit Creation Tests", () => {
	beforeAll(async () => {
		await connectToDatabase();
		await dropAllCollection();
	});

	afterAll(async () => await closeConnection());

	const apollo = new ApolloServer({ schema: schema });

	it("should successfully create a fruit", async () => {
		const result = await apollo.executeOperation({
			query: createFruitForFruitStorageQuery,
			variables: {
				name: "lemon",
				description: "this is a lemon",
				limitOfFruitToBeStored: 10,
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.createFruitForFruitStorage).toBeTruthy();
		expect(data.createFruitForFruitStorage.fruit.name).toBe("lemon");
		expect(data.createFruitForFruitStorage.fruit.description).toBe("this is a lemon");
		expect(data.createFruitForFruitStorage.limit).toBe(10);
	});

	it("should return an error due to a long description", async () => {
		const result = await apollo.executeOperation({
			query: createFruitForFruitStorageQuery,
			variables: {
				name: "lemon",
				description: "this is a fruit with a very long description",
				limitOfFruitToBeStored: 10,
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe("Text is greater than 30 chars.");
		expect(data).toBe(null);
	});

	it("should return an error due to duplication fruit entry", async () => {
		const result = await apollo.executeOperation({
			query: createFruitForFruitStorageQuery,
			variables: {
				name: "lemon",
				description: "this is a lemon",
				limitOfFruitToBeStored: 10,
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe("The fruit name 'lemon' already exist!");
		expect(data).toBe(null);
	});
});
