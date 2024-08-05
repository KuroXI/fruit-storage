import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { CreateFruit } from "./createFruit";
import { CreateFruitController } from "./createFruitController";

const createFruitUseCase = new CreateFruit(fruitRepository, unitOfWork);
const createFruitController = new CreateFruitController(createFruitUseCase);

export { createFruitUseCase, createFruitController };
