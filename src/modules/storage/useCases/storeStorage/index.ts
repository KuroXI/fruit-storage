import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { StoreStorage } from "./storeStorage";

const storeStorage = new StoreStorage(storageRepository, unitOfWork);

export { storeStorage };
