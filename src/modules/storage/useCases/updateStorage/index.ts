import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { UpdateStorage } from "./updateStorage";

const updateStorage = new UpdateStorage(storageRepository, unitOfWork);

export { updateStorage };
