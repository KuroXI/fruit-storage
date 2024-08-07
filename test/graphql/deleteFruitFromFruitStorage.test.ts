import { ApolloServer } from "@apollo/server";
import schema from "../../src/shared/infrastructure/http/graphql/schema";
import { unitOfWork } from "../../src/shared/infrastructure/unitOfWork";
import type { UnitOfWork } from "../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import { deleteFruitFromFruitStorageQuery } from "../query";
import { seedFruitForFruitStorage } from "../seed/seedFruitForFruitStorage";
import { closeConnection, connectToDatabase, dropAllCollection } from "../utils";
import { DeleteFruitByNameOutbox } from "../../src/modules/fruit/useCases/deleteFruitByName/deleteFruitByNameOutbox";

jest.mock("../../src/modules/fruit/useCases/deleteFruitByName/deleteFruitByNameOutbox");
jest.mock("../../src/shared/infrastructure/unitOfWork/implementations/UnitOfWork");

const seed = {
	name: "lemon",
	description: "this is a lemon",
	limit: 10,
	amount: 5,
};

describe("Fruit Deletion Tests", () => {
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

	it("should return an error when attempting to delete a fruit without force delete", async () => {
		const result = await apollo.executeOperation({
			query: deleteFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				forceDelete: false,
			},
		});

		expect(DeleteFruitByNameOutbox.emit).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toBe(
			"Fruit cannot be deleted because it still has an amount stored.",
		);
		expect(data).toBe(null);
	});

	it("should successfully force delete a fruit", async () => {
		const result = await apollo.executeOperation({
			query: deleteFruitFromFruitStorageQuery,
			variables: {
				name: "lemon",
				forceDelete: true,
			},
		});

		expect(DeleteFruitByNameOutbox.emit).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.abortTransaction).toHaveBeenCalledTimes(0);
		expect(mockUnitOfWork.commitTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.endTransaction).toHaveBeenCalledTimes(1);
		expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(1);

		// @ts-ignore
		const { data, errors } = result.body.singleResult;

		expect(errors).toBeFalsy();
		expect(data.deleteFruitFromFruitStorage).toBeTruthy();
		expect(data.deleteFruitFromFruitStorage.fruit.name).toBe("lemon");
	});
});
