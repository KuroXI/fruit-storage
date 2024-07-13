import { storageRepository } from "../../repositories/implementations";
import { RemoveStorage } from "./removeStorage";

const removeStorage = new RemoveStorage(storageRepository);

export { removeStorage };
