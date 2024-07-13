import "jest";

import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { deleteFruitFromFruitStorageQuery } from "../query";
import { seedFruitForFruitStorage } from "../seed/seedFruitForFruitStorage";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

const seed = {
  name: "lemon",
  description: "this is a lemon",
  limit: 10,
  amount: 5,
}

describe("Fruit Deletion Tests", () => {
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

	it("should return an error when attempting to delete a fruit without force delete", async () => {
		const result = await apollo.executeOperation({
			query: deleteFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				forceDelete: false,
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeTruthy();
		expect(data).toBeFalsy();
	});

	it("should successfully force delete a fruit", async () => {
		const result = await apollo.executeOperation({
			query: deleteFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				forceDelete: true,
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.deleteFruitFromFruitStorage).toBeTruthy();
		expect(data.deleteFruitFromFruitStorage.fruit.name).toBe("lemon");
	});
});
