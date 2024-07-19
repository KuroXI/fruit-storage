import { storageRepository } from "../../repositories";
import { GetStorage } from "./getStorage";

const getStorage = new GetStorage(storageRepository);

export { getStorage };
