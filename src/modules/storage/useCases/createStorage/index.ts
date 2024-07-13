import { storageRepository } from "../../repositories/implementations";
import { CreateStorage } from "./createStorage";

const createStorage = new CreateStorage(storageRepository);

export { createStorage };
