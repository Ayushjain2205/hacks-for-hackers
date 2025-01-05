import { MLflowClient } from "mlflow";
import prisma from "./db";

export class MLflowTracker {
  private client: MLflowClient;

  constructor() {
    this.client = new MLflowClient();
  }

  async trackExperiment(
    versionId: string,
    metrics: any,
    parameters: any,
    artifacts: string[] = []
  ) {
    try {
      // Create experiment in database
      const experiment = await prisma.mLExperiment.create({
        data: {
          name: `Version ${versionId}`,
          metrics,
          parameters,
          artifacts,
          versionId,
        },
      });

      // Log to MLflow
      const run = await this.client.createRun({
        experiment_id: versionId,
        tags: [
          { key: "version_id", value: versionId },
          { key: "type", value: "prompt_version" },
        ],
      });

      // Log metrics
      for (const [key, value] of Object.entries(metrics)) {
        await this.client.logMetric(run.info.run_id, key, value);
      }

      // Log parameters
      for (const [key, value] of Object.entries(parameters)) {
        await this.client.logParam(run.info.run_id, key, String(value));
      }

      // Log artifacts
      for (const artifact of artifacts) {
        await this.client.logArtifact(run.info.run_id, artifact);
      }

      return experiment;
    } catch (error) {
      console.error("Failed to track experiment:", error);
      throw error;
    }
  }

  async getExperiments(versionId: string) {
    try {
      return await prisma.mLExperiment.findMany({
        where: {
          versionId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Failed to fetch experiments:", error);
      throw error;
    }
  }
}
