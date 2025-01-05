import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { MLflowClient } from "mlflow";

const mlflow = new MLflowClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { variationId } = req.query;
      const versions = await prisma.version.findMany({
        where: {
          variationId: variationId as string,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json(versions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch versions" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        note,
        prompt,
        output,
        promptTokens,
        outputTokens,
        metadata,
        tags,
        variationId,
      } = req.body;

      // Create version in database
      const version = await prisma.version.create({
        data: {
          note,
          prompt,
          output,
          promptTokens,
          outputTokens,
          metadata,
          tags,
          variationId,
        },
      });

      // Log experiment in MLflow
      const experiment = await prisma.mLExperiment.create({
        data: {
          name: `Version ${version.id}`,
          metrics: {
            promptTokens,
            outputTokens,
            // Add other relevant metrics
          },
          parameters: {
            ...metadata,
            prompt,
          },
          artifacts: [], // Add any generated artifacts
          versionId: version.id,
        },
      });

      res.status(201).json({ version, experiment });
    } catch (error) {
      res.status(500).json({ error: "Failed to create version" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
