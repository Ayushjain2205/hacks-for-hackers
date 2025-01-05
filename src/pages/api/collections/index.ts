import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const collections = await prisma.collection.findMany({
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          variations: {
            include: {
              versions: true,
            },
          },
        },
      });
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, icon, model, description, authorId, tags } = req.body;
      const collection = await prisma.collection.create({
        data: {
          name,
          icon,
          model,
          description,
          authorId,
          tags,
        },
      });
      res.status(201).json(collection);
    } catch (error) {
      res.status(500).json({ error: "Failed to create collection" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
