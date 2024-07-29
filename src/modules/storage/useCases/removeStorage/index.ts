import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { RemoveStorage } from "./removeStorage";

const removeStorage = new RemoveStorage(storageRepository, unitOfWork);

export { removeStorage };
