import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { CreateFruit } from "./createFruit";

const createFruit = new CreateFruit(fruitRepository, unitOfWork);

export { createFruit };
