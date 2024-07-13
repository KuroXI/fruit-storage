import { Kafka, Partitioners } from "kafkajs";
import { kafkaConfig } from "../../../config";

const kafka = new Kafka(kafkaConfig.clientConfig);

const consumer = kafka.consumer({ groupId: "fruit-consumer" });

const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

export { consumer, producer };
