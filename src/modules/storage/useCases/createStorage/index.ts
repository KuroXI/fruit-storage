import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { CreateStorage } from "./createStorage";

const createStorage = new CreateStorage(storageRepository, unitOfWork);

export { createStorage };
