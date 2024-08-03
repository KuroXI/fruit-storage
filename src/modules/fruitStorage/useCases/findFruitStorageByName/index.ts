import { fruitRepository, storageRepository } from "../../repositories";
import { FindFruitStorageByName } from "./findFruitStorageByName";
import { FindFruitStorageByNameController } from "./findFruitStorageByNameController";

const findFruitStorageByName = new FindFruitStorageByName(fruitRepository, storageRepository);
const findFruitStorageByNameController = new FindFruitStorageByNameController(findFruitStorageByName);

export { findFruitStorageByName, findFruitStorageByNameController };
