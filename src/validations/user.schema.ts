import { z } from "zod";
import { ALLOWED_ROLES } from "../consts/roles";

const pluralFormatter = new Intl.ListFormat("es", {
    type: "disjunction"
});
const allowedRolesMessage = pluralFormatter.format(ALLOWED_ROLES);

export const createUserSchema = z.object({
    username: z.string().min(1, {
        message: "El nombre de usuario es requerido"
    }).max(255, {
        message: "El nombre de usuario debe tener máximo 255 caracteres"
    }),
    email: z.string().min(1, {
        message: "El correo electrónico es requerido"
    }).email({
        message: "Correo electrónico no es válido"
    }),
    roles: z.array(z.enum(ALLOWED_ROLES, {
        message: "El rol debe ser uno de " + allowedRolesMessage
    })),
    password: z.string()
        .refine((password) => /[A-Z]/.test(password), {
            message: "La contraseña debe tener al menos una mayúscula",
        })
        .refine((password) => /[a-z]/.test(password), {
            message: "La contraseña debe tener al menos una minúscula",
        })
        .refine((password) => /[0-9]/.test(password), {
            message: "La contraseña debe tener al menos un número"
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "La contraseña debe tener al menos un caracter especial",
        })
});

export const userIdSchema = z.object({
    userId: z.number({ message: "ID de usuario inválida" })
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserData = z.infer<typeof updateUserSchema>;

export const signInSchema = z.object({
    username: z.string(),
    password: z.string()
});

export type SignInData = z.infer<typeof signInSchema>;