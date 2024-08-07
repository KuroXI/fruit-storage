import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { CreateStorage } from "./createStorage";
import { CreateStorageController } from "./createStorageController";

const createStorageUseCase = new CreateStorage(storageRepository, unitOfWork);
const createStorageController = new CreateStorageController(createStorageUseCase);

export { createStorageUseCase, createStorageController };
