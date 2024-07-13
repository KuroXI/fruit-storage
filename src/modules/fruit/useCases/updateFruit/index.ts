import { fruitRepository } from "../../repositories/implementations";
import { UpdateFruit } from "./updateFruit";

const updateFruit = new UpdateFruit(fruitRepository);

export { updateFruit };
