import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: ["./test/utils.ts"],
	verbose: true,
};

export default config;
