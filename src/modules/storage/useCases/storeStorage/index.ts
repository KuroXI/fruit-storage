import { storageRepository } from "../../repositories";
import { StoreStorage } from "./storeStorage";

const storeStorage = new StoreStorage(storageRepository);

export { storeStorage };
