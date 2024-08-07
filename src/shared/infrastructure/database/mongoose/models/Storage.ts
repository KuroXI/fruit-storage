import mongoose, { Schema, type Types } from "mongoose";

export interface IStorage {
	id: Types.ObjectId;
	fruitId: Types.ObjectId;
	limit: number;
	amount: number;
}

const StorageSchema = new Schema({
	id: {
		type: Schema.Types.ObjectId,
		index: {
			required: true,
		},
	},
	fruitId: {
		type: String,
		index: {
			required: true,
			unique: true,
		},
	},
	limit: { type: Number },
});

export const StorageModel = mongoose.model<IStorage>("Storage", StorageSchema);
