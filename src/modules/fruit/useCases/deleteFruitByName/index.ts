import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { DeleteFruitByName } from "./deleteFruitByName";
import { DeleteFruitByNameController } from "./deleteFruitByNameController";

const deleteFruitByNameUseCase = new DeleteFruitByName(fruitRepository, unitOfWork);
const deleteFruitByNameController = new DeleteFruitByNameController(deleteFruitByNameUseCase);

export { deleteFruitByNameUseCase, deleteFruitByNameController };
