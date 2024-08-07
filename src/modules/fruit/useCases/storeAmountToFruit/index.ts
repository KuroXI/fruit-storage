import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { StoreAmountToFruit } from "./storeAmountToFruit";
import { StoreAmountToFruitController } from "./storeAmountToFruitController";

const storeAmountToFruitUseCase = new StoreAmountToFruit(fruitRepository, unitOfWork);
const storeAmountToFruitController = new StoreAmountToFruitController(storeAmountToFruitUseCase);

export { storeAmountToFruitUseCase, storeAmountToFruitController };
