import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository, storageRepository } from "../../repositories";
import { StoreAmountToFruitStorage } from "./storeAmountToFruitStorage";
import { StoreAmountToFruitStorageController } from "./storeAmountToFruitStorageController";

const storeAmountToFruitStorage = new StoreAmountToFruitStorage(
	fruitRepository,
	storageRepository,
	unitOfWork,
);
const storeAmountToFruitStorageController = new StoreAmountToFruitStorageController(
	storeAmountToFruitStorage,
);

export { storeAmountToFruitStorage, storeAmountToFruitStorageController };
