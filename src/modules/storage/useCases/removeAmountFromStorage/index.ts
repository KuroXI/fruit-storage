import { storageRepository } from "../../repositories";
import { RemoveAmountFromStorage } from "./removeAmountFromStorage";
import { RemoveAmountFromStorageController } from "./removeAmountFromStorageController";

const removeAmountFromStorageUseCase = new RemoveAmountFromStorage(storageRepository);
const removeAmountFromStorageController = new RemoveAmountFromStorageController(
	removeAmountFromStorageUseCase,
);

export { removeAmountFromStorageUseCase, removeAmountFromStorageController };
