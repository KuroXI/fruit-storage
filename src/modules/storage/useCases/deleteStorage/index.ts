import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { DeleteStorage } from "./deleteStorage";

const deleteStorage = new DeleteStorage(storageRepository, unitOfWork);

export { deleteStorage };
