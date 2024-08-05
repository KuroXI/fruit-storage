import { storageRepository } from "../../repositories";
import { CreateStorage } from "./createStorage";
import { CreateStorageController } from "./createStorageController";

const createStorageUseCase = new CreateStorage(storageRepository);
const createStorageController = new CreateStorageController(createStorageUseCase);

export { createStorageUseCase, createStorageController };
