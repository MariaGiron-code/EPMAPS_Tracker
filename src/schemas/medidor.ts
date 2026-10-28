import { z } from "zod";

export const codigoMedidorSchema = z
  .string()
  .regex(/^MED-\d{6}$/, "El código debe ser MED- seguido de seis dígitos");

export const estadoMedidorSchema = z.enum(["normal", "inaccesible", "danado"]);

export const lecturaFormSchema = z
  .object({
    codigo: codigoMedidorSchema,
    estado: estadoMedidorSchema,
    lectura: z.coerce.number().optional(),
    motivo: z.string().optional(),
    descripcionDano: z.string().optional(),
    fotoRuta: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.estado === "normal") {
      if (data.lectura === undefined || Number.isNaN(data.lectura)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["lectura"], message: "La lectura es obligatoria" });
      }
    }
    if (data.estado === "inaccesible") {
      if (!data.motivo?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["motivo"], message: "El motivo es obligatorio" });
      }
      if (data.lectura !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["lectura"], message: "No se permite lectura" });
      }
    }
    if (data.estado === "danado") {
      if (!data.descripcionDano?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["descripcionDano"], message: "La descripción del daño es obligatoria" });
      }
    }
  });

export type LecturaForm = z.infer<typeof lecturaFormSchema>;
