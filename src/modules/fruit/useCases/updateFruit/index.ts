import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { UpdateFruit } from "./updateFruit";
import { UpdateFruitController } from "./updateFruitController";

const updateFruitUseCase = new UpdateFruit(fruitRepository, unitOfWork);
const updatedFruitController = new UpdateFruitController(updateFruitUseCase);

export { updateFruitUseCase, updatedFruitController };
