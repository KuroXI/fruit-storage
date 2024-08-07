import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { RemoveAmountFromFruit } from "./removeAmountFromFruit";
import { RemoveAmountFromFruitController } from "./removeAmountFromFruitController";

const removeAmountFromFruitUseCase = new RemoveAmountFromFruit(fruitRepository, unitOfWork);
const removeAmountFromFruitController = new RemoveAmountFromFruitController(
	removeAmountFromFruitUseCase,
);

export { removeAmountFromFruitUseCase, removeAmountFromFruitController };
