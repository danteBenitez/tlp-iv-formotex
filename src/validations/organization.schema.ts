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

export const organizationIdSchema = z.object({
    params: z.object({
        organizationId: z.number({
            message: "El ID de organización es requerido",
            coerce: true
        }).int({
            message: "El ID de organización debe ser un entero"
        })
    })
});

export const updateOrganizationSchema = z.intersection(z.object({
    body: createOrganizationSchema.partial(),
}), organizationIdSchema);


export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>["body"];