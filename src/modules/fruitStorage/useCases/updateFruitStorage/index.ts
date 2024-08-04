import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository, storageRepository } from "../../repositories";
import { UpdateFruitStorage } from "./updateFruitStorage";
import { UpdateFruitStorageController } from "./updateFruitStorageController";

const updateFruitStorage = new UpdateFruitStorage(fruitRepository, storageRepository, unitOfWork);
const updateFruitStorageController = new UpdateFruitStorageController(updateFruitStorage);

export { updateFruitStorage, updateFruitStorageController };
