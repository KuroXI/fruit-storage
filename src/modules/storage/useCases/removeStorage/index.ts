import { storageRepository } from "../../repositories";
import { RemoveStorage } from "./removeStorage";

const removeStorage = new RemoveStorage(storageRepository);

export { removeStorage };
