import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { storageRepository } from "../../repositories";
import { DeleteStorageByFruitId } from "./deleteStorageByFruitId";
import { DeleteStorageByFruitIdController } from "./deleteStorageByFruitIdController";

const deleteStorageByFruitIdUseCase = new DeleteStorageByFruitId(storageRepository, unitOfWork);
const deleteStorageByFruitIdController = new DeleteStorageByFruitIdController(
	deleteStorageByFruitIdUseCase,
);

export { deleteStorageByFruitIdUseCase, deleteStorageByFruitIdController };
