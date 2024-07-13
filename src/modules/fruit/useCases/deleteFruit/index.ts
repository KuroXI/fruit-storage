import { fruitRepository } from "../../repositories/implementations";
import { DeleteFruit } from "./deleteFruit";

const deleteFruit = new DeleteFruit(fruitRepository);

export { deleteFruit };
