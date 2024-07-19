import { fruitRepository } from "../../repositories";
import { DeleteFruit } from "./deleteFruit";

const deleteFruit = new DeleteFruit(fruitRepository);

export { deleteFruit };
