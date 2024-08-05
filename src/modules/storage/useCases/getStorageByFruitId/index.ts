import { storageRepository } from "../../repositories";
import { GetStorageByFruitId } from "./getStorageByFruitId";
import { GetStorageByFruitIdController } from "./getStorageByFruitIdController";

const getStorageByFruitIdUseCase = new GetStorageByFruitId(storageRepository);
const getStorageByFruitIdController = new GetStorageByFruitIdController(getStorageByFruitIdUseCase);

export { getStorageByFruitIdUseCase, getStorageByFruitIdController };
