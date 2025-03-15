import {z, ZodSchema} from "zod";

export type ClientSpiralPayload = {
  url: {
    raw: string
  },
  userAgent: string
  ttwid: string
}

export type SpiralData = ClientSpiralPayload & {
  url: {
    data: {
      pushServer: string
      routeParams: { imprp?: string, wrss?: string }
      roomId: string
      cursor: string,
      internalExt: string
    }
  }
}

const urlSchema = z.string().url().max(2048);

export const clientSpiralSchema: ZodSchema<ClientSpiralPayload> = z.object({
  url: z.object({
    raw: urlSchema
  }),
  userAgent: z.string().trim().min(1).max(300), // Enforce userAgent length
  ttwid: z.string().max(256) // Ensure valid token format
});

export const spiralDataSchema: ZodSchema<SpiralData> = (clientSpiralSchema as any).extend({
  url: z.object({
    raw: urlSchema,
    data: z.object({
      pushServer: urlSchema,
      routeParams: z.object({
        imprp: z.string().trim().max(64).optional(),
        wrss: z.string().trim().max(64).optional()
      }),
      roomId: z.string().regex(/^\d+$/).max(20), // Ensure only numbers for roomId
      cursor: z.string().trim().max(256), // Cursor should be reasonable
      internalExt: z.string().trim().max(256) // Internal extension should be
    })
  })
});
