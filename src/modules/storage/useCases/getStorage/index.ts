import { storageRepository } from "../../repositories/implementations";
import { GetStorage } from "./getStorage";

const getStorage = new GetStorage(storageRepository);

export { getStorage };
