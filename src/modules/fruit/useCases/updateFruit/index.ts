import { fruitRepository } from "../../repositories";
import { UpdateFruit } from "./updateFruit";

const updateFruit = new UpdateFruit(fruitRepository);

export { updateFruit };
