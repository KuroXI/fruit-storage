import { storageRepository } from "../../repositories";
import { CreateStorage } from "./createStorage";

const createStorage = new CreateStorage(storageRepository);

export { createStorage };
