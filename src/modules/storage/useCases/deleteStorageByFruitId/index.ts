import { storageRepository } from "../../repositories";
import { DeleteStorageByFruitId } from "./deleteStorageByFruitId";
import { DeleteStorageByFruitIdController } from "./deleteStorageByFruitIdController";

const deleteStorageByFruitIdUseCase = new DeleteStorageByFruitId(storageRepository);
const deleteStorageByFruitIdController = new DeleteStorageByFruitIdController(
	deleteStorageByFruitIdUseCase,
);

export { deleteStorageByFruitIdUseCase, deleteStorageByFruitIdController };
