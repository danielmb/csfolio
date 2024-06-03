import { z } from "zod";

export const registerRouteSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type RegisterRouteSchema = z.infer<typeof registerRouteSchema>;
export type RegisterRouteSchemaInput = z.input<typeof registerRouteSchema>;
