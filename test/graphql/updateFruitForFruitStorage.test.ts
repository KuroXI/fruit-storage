import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { unitOfWork } from "../../src/shared/infrastructure/unitOfWork";
import type { UnitOfWork } from "../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import { updateFruitForFruitStorageQuery } from "../query";
import { seedFruitForFruitStorage } from "../seed/seedFruitForFruitStorage";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

jest.mock("../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork");

const seed = {
	name: "lemon",
	description: "this is a lemon",
	limit: 10,
	amount: 0,
};

describe("Fruit Update Tests", () => {
	let mockUnitOfWork: UnitOfWork;

	beforeAll(async () => await connectToDatabase());

	beforeEach(async () => {
		mockUnitOfWork = unitOfWork;
		jest.resetAllMocks();
		
		await dropAllCollection();
		await seedFruitForFruitStorage(seed);
	});

	afterAll(async () => await closeConnection());

	const apollo = new ApolloServer({ schema: schema });

	it("should successfully update the description of a fruit", async () => {
		const result = await apollo.executeOperation({
			query: updateFruitForFruitStorageQuery,
			variables: {
				name: "lemon",
				description: "updated lemon description",
				limitOfFruitToBeStored: 10,
			},
		});

		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(2);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(2);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(2);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.updateFruitForFruitStorage).toBeTruthy();
		expect(data.updateFruitForFruitStorage.fruit.name).toBe("lemon");
		expect(data.updateFruitForFruitStorage.fruit.description).toBe("updated lemon description");
		expect(data.updateFruitForFruitStorage.limit).toBe(10);
	});

	it("should return an error due to a long description when updating a fruit", async () => {
		const result = await apollo.executeOperation({
			query: updateFruitForFruitStorageQuery,
			variables: {
				name: "lemon",
				description: "updated lemon with a long description",
				limitOfFruitToBeStored: 10,
			},
		});

		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe("Text is greater than 30 chars.");
		expect(data).toBe(null);
	});
});
