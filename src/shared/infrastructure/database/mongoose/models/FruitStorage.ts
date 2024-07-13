import mongoose, { Schema, type Types } from "mongoose";

export interface IFruitStorage {
	id: Types.ObjectId;
	fruitId: Types.ObjectId;
	limit: number;
	amount: number;
}

const FruitStorageSchema = new Schema({
	id: {
		type: Schema.Types.ObjectId,
		index: {
			required: true,
		},
	},
	fruitId: {
		type: Schema.Types.ObjectId,
		index: {
			required: true,
			unique: true,
		},
	},
	limit: { type: Number },
	amount: { type: Number },
});

export const FruitStorageModel = mongoose.model<IFruitStorage>("FruitStorage", FruitStorageSchema);
