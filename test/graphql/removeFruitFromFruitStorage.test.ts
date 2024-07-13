import "jest";

import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { removeFruitFromFruitStorageQuery } from "../query";
import { seedFruitForFruitStorage } from "../seed/seedFruitForFruitStorage";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

const seed = {
  name: "lemon",
  description: "this is a lemon",
  limit: 10,
  amount: 5,
}

describe("Fruit Remove Tests", () => {
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

  it("should successfully remove a fruit with an amount of 5", async () => {
		const result = await apollo.executeOperation({
			query: removeFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				amount: 5
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.removeFruitFromFruitStorage).toBeTruthy();
		expect(data.removeFruitFromFruitStorage.fruit.name).toBe("lemon");
    expect(data.removeFruitFromFruitStorage.amount).toBe(0);
	});

	it("should fail to remove a fruit with an amount greater than stored", async () => {
		const result = await apollo.executeOperation({
			query: removeFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				amount: 6,
			},
		});

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeTruthy();
		expect(data).toBeFalsy();
	});
});
