import { fruitRepository } from "../../repositories/implementations";
import { CreateFruit } from "./createFruit";

const createFruit = new CreateFruit(fruitRepository);

export { createFruit };
