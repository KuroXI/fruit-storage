import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository, storageRepository } from "../../repositories";
import { RemoveAmountFromFruitStorage } from "./removeAmountFromFruitStorage";
import { RemoveAmountFromFruitStorageController } from "./removeAmountFromFruitStorageController";

const removeAmountFromFruitStorage = new RemoveAmountFromFruitStorage(
	fruitRepository,
	storageRepository,
	unitOfWork,
);
const removeAmountFromFruitStorageController = new RemoveAmountFromFruitStorageController(
	removeAmountFromFruitStorage,
);

export { removeAmountFromFruitStorage, removeAmountFromFruitStorageController };
