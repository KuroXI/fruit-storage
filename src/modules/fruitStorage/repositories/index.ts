import { models } from "../../../shared/infrastructure/database/mongoose/models";
import { FruitRepository } from "./implementations/fruitRepository";
import { StorageRepository } from "./implementations/storageRepository";

const fruitRepository = new FruitRepository(models.fruit);
const storageRepository = new StorageRepository(models.storage);

export { fruitRepository, storageRepository };
