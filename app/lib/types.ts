import { Episode } from "@prisma/client";

export type PartialEpisode = Omit<Episode, "id" | "createdAt" | "updatedAt">