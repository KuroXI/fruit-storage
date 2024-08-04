import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository, storageRepository } from "../../repositories";
import { CreateFruitStorage } from "./createFruitStorage";
import { CreateFruitStorageController } from "./createFruitStorageController";

const createFruitStorage = new CreateFruitStorage(fruitRepository, storageRepository, unitOfWork);
const createFruitStorageController = new CreateFruitStorageController(createFruitStorage);

export { createFruitStorage, createFruitStorageController };
