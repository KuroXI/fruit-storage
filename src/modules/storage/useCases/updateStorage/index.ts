import { storageRepository } from "../../repositories";
import { UpdateStorage } from "./updateStorage";

const updateStorage = new UpdateStorage(storageRepository);

export { updateStorage };
