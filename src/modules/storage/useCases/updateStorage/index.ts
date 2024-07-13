import { storageRepository } from "../../repositories/implementations";
import { UpdateStorage } from "./updateStorage";

const updateStorage = new UpdateStorage(storageRepository);

export { updateStorage };
