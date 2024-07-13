import "jest";

import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { storeFruitToFruitStorageQuery } from "../query";
import { seedFruitForFruitStorage } from "../seed/seedFruitForFruitStorage";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

const seed = {
  name: "lemon",
  description: "this is a lemon",
  limit: 10,
  amount: 0,
}

describe("Fruit Store Tests", () => {
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

  it("should successfully store a fruit with an amount of 5", async () => {
		const result = await apollo.executeOperation({
			query: storeFruitToFruitStorageQuery,
			variables: {
				name: "lemon",
				amount: 5
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.storeFruitToFruitStorage).toBeTruthy();
		expect(data.storeFruitToFruitStorage.fruit.name).toBe("lemon");
    expect(data.storeFruitToFruitStorage.amount).toBe(5);
	});

	it("should fail to store a fruit with an amount greater than the storage limit", async () => {
		const result = await apollo.executeOperation({
			query: storeFruitToFruitStorageQuery,
			variables: {
				name: "lemon",
				amount: 11,
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeTruthy();
		expect(data).toBeFalsy();
	});
});
