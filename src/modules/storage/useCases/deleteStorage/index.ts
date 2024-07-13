import { storageRepository } from "../../repositories/implementations";
import { DeleteStorage } from "./deleteStorage";

const deleteStorage = new DeleteStorage(storageRepository);

export { deleteStorage };
