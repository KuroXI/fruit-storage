import { models } from "../../../../shared/infrastructure/database/mongoose/models";
import { StorageRepository } from "./mongoose/storageRepository";

const storageRepository = new StorageRepository(models.fruitStorage);

export { storageRepository };
