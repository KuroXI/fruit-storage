import { storageRepository } from "../../repositories";
import { StoreAmountToStorage } from "./storeAmountToStorage";
import { StoreAmountToStorageController } from "./storeAmountToStorageController";

const storeAmountToStorageUseCase = new StoreAmountToStorage(storageRepository);
const storeAmountToStorageController = new StoreAmountToStorageController(
	storeAmountToStorageUseCase,
);

export { storeAmountToStorageUseCase, storeAmountToStorageController };
