import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { DeleteFruit } from "./deleteFruit";

const deleteFruit = new DeleteFruit(fruitRepository, unitOfWork);

export { deleteFruit };
