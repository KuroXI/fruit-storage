import { booleanArg, intArg, mutationType, nonNull, stringArg } from "nexus";
import type { NexusGenRootTypes } from "./nexus/types";
import { createFruitForFruitStorageResolver } from "./resolver/createFruitForFruitStorageResolver";
import { deleteFruitFromFruitStorageResolver } from "./resolver/deleteFruitFromFruitStorageResolver";
import { removeFruitFromFruitStorageResolver } from "./resolver/removeFruitFromFruitStorageResolver";
import { storeFruitToFruitStorageResolver } from "./resolver/storeFruitToFruitStorageResolver";
import { updateFruitForFruitStorageResolver } from "./resolver/updateFruitForFruitStorageResolver";

export const mutation = mutationType({
	definition(type) {
		type.nonNull.field("storeFruitToFruitStorage", {
			type: "ReturnQuery",
			args: {
				name: nonNull(stringArg()),
				amount: nonNull(intArg()),
			},
			resolve: (_, args) =>
				storeFruitToFruitStorageResolver(args) as NexusGenRootTypes["ReturnQuery"],
		});
		type.nonNull.field("removeFruitFromFruitStorage", {
			type: "ReturnQuery",
			args: {
				name: nonNull(stringArg()),
				amount: nonNull(intArg()),
			},
			resolve: (_, args) =>
				removeFruitFromFruitStorageResolver(args) as NexusGenRootTypes["ReturnQuery"],
		});
		type.nonNull.field("createFruitForFruitStorage", {
			type: "Fruit",
			args: {
				name: nonNull(stringArg()),
				description: nonNull(stringArg()),
				limitOfFruitToBeStored: nonNull(intArg()),
			},
			resolve: (_, args) =>
				createFruitForFruitStorageResolver(args) as NexusGenRootTypes["Fruit"],
		});
		type.nonNull.field("updateFruitForFruitStorage", {
			type: "ReturnQuery",
			args: {
				name: nonNull(stringArg()),
				description: nonNull(stringArg()),
				limitOfFruitToBeStored: nonNull(intArg()),
			},
			resolve: (_, args) =>
				updateFruitForFruitStorageResolver(args) as NexusGenRootTypes["ReturnQuery"],
		});
		type.nonNull.field("deleteFruitFromFruitStorage", {
			type: "ReturnQuery",
			args: {
				name: nonNull(stringArg()),
				forceDelete: nonNull(booleanArg({ default: false })),
			},
			resolve: (_, args) =>
				deleteFruitFromFruitStorageResolver(args) as NexusGenRootTypes["ReturnQuery"],
		});
	},
});
