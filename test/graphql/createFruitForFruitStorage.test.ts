import { ApolloServer } from "@apollo/server";
import { CreateFruitOutbox } from "../../src/modules/fruit/useCases/createFruit/createFruitOutbox";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { unitOfWork } from "../../src/shared/infrastructure/unitOfWork";
import type { UnitOfWork } from "../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import { createFruitForFruitStorageQuery } from "../query";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";

jest.mock("../../src/modules/fruit/useCases/createFruit/createFruitOutbox");
jest.mock("../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork");

describe("Fruit Creation Tests", () => {
	let mockUnitOfWork: UnitOfWork;

	beforeAll(async () => {
		await connectToDatabase();
		await dropAllCollection();
	});

	beforeEach(() => {
		mockUnitOfWork = unitOfWork;
		jest.resetAllMocks();
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

		expect(CreateFruitOutbox.emit).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.createFruitForFruitStorage).toBeTruthy();
		expect(data.createFruitForFruitStorage.name).toBe("lemon");
		expect(data.createFruitForFruitStorage.description).toBe("this is a lemon");
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

		expect(CreateFruitOutbox.emit).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe("Text is greater than 30 chars.");
		expect(data).toBe(null);
		expect(CreateFruitOutbox.emit).toHaveBeenCalledTimes(0);
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
		
		expect(CreateFruitOutbox.emit).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe("The fruit name 'lemon' already exist!");
		expect(data).toBe(null);
	});
});
