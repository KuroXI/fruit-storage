import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { UpdateStorageByFruitId } from "./updateStorageByFruitId";
import { UpdateStorageByFruitIdController } from "./updateStorageByFruitIdController";

const updateStorageByFruitIdUseCase = new UpdateStorageByFruitId(storageRepository, unitOfWork);
const updateStorageByFruitIdController = new UpdateStorageByFruitIdController(
	updateStorageByFruitIdUseCase,
);

export { updateStorageByFruitIdUseCase, updateStorageByFruitIdController };
