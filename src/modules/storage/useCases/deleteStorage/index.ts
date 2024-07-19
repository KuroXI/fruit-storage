import { storageRepository } from "../../repositories";
import { DeleteStorage } from "./deleteStorage";

const deleteStorage = new DeleteStorage(storageRepository);

export { deleteStorage };
