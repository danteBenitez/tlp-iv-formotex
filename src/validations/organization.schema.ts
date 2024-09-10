import { z } from "zod";

export const createOrganizationSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre de la organización es requerido"
    }),
    location: z.string().min(1, {
        message: "La ubicación de la organización es requerida"
    })
});

export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>;