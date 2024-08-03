import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository, storageRepository } from "../../repositories";
import { DeleteFruitStorageByName } from "./deleteFruitStorageByName";
import { DeleteFruitStorageByNameController } from "./deleteFruitStorageByNameController";

const deleteFruitStorageByName = new DeleteFruitStorageByName(fruitRepository, storageRepository, unitOfWork);
const deleteFruitStorageByNameController = new DeleteFruitStorageByNameController(deleteFruitStorageByName);

export { deleteFruitStorageByName, deleteFruitStorageByNameController };
