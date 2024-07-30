import type { KafkaConfig } from "kafkajs";

const kafkaConfig = {
	topicId: "fruit-storage",
	clientConfig: {
		clientId: "fruit-storage",
		brokers: [process.env.KAFKA_ENDPOINT as string],
		ssl: true,
		sasl: {
			mechanism: "scram-sha-256",
			username: process.env.KAFKA_USERNAME as string,
			password: process.env.KAFKA_PASSWORD as string,
		},
	} as KafkaConfig,
};

export { kafkaConfig };
