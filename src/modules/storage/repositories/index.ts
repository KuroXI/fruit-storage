import { models } from "../../../shared/infrastructure/database/mongoose/models";
import { StorageRepository } from "./implementations/storageRepository";

const storageRepository = new StorageRepository(models.storage);

export { storageRepository };
