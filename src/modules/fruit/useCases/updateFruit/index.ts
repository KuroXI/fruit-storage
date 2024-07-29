import { unitOfWork } from "../../../../shared/infrastructure/unitOfWork";
import { fruitRepository } from "../../repositories";
import { UpdateFruit } from "./updateFruit";

const updateFruit = new UpdateFruit(fruitRepository, unitOfWork);

export { updateFruit };
