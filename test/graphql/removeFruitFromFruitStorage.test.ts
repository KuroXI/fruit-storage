import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { unitOfWork } from "../../src/shared/infrastructure/unitOfWork";
import type { UnitOfWork } from "../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import { removeFruitFromFruitStorageQuery } from "../query";
import { seedFruitForFruitStorage } from "../seed/seedFruitForFruitStorage";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

jest.mock("../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork");

const seed = {
	name: "lemon",
	description: "this is a lemon",
	limit: 10,
	amount: 5,
};

describe("Fruit Remove Tests", () => {
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

	it("should successfully remove a fruit with an amount of 5", async () => {
		const result = await apollo.executeOperation({
			query: removeFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				amount: 5,
			},
		});

		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.removeFruitFromFruitStorage).toBeTruthy();
		expect(data.removeFruitFromFruitStorage.fruit.name).toBe("lemon");
		expect(data.removeFruitFromFruitStorage.fruit.amount).toBe(0);
	});

	it("should fail to remove a fruit with an amount greater than stored", async () => {
		const result = await apollo.executeOperation({
			query: removeFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				amount: 6,
			},
		});

		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe(
			"The amount to be removed exceeds the available storage amount.",
		);
		expect(data).toBe(null);
	});
});
