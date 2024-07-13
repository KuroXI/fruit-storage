import { storageRepository } from "../../repositories/implementations";
import { StoreStorage } from "./storeStorage";

const storeStorage = new StoreStorage(storageRepository);

export { storeStorage };
