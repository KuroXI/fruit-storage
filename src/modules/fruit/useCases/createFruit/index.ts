import { fruitRepository } from "../../repositories";
import { CreateFruit } from "./createFruit";

const createFruit = new CreateFruit(fruitRepository);

export { createFruit };
