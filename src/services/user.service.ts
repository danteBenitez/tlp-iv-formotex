import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Op } from "sequelize";
import { z } from "zod";
import { config } from "../config/config.service.js";
import { RoleName } from "../consts/roles.js";
import { IUser } from "../interfaces/user.interface.js";
import Role from "../models/role.model.js";
import UserRole from "../models/user-roles.model.js";
import User from "../models/user.model.js";
import { CreateUserByAdmin, CreateUserData, SignInData, UpdateUserByAdmin, UpdateUserData } from "../validations/user.schema.js";
import { EncryptionService, encryptionService } from "./encryption.service.js";

export class ConflictingUserError extends Error { }
export class UserNotFoundError extends Error { }
export class InvalidSignInError extends Error { }
export class InvalidRoleError extends Error { }
export class InvalidDataError extends Error { }

export class UsersService {
    constructor(
        private userModel: typeof User,
        private roleModel: typeof Role,
        private encryptionService: EncryptionService,
        private userRoleModel: typeof UserRole
    ) { }

    /**
     * Crea un JWT para el usuario pasado como parámetro
     * @param {User} user
     */
    async createTokenFor(user: IUser) {
        return new Promise((resolve, reject) => {
            jwt.sign({ userId: user.userId }, config.getSecret(), (err: Error | null, data: string | undefined) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

    /**
     * Encuentra un usuario dado un JWT
     *
     * @param {string} token
     * @returns {Promise<User | null>} Retorna el usuario o
     * null si no se puede verificar el token.
     */
    async findForToken(token: string) {
        try {
            const data = await new Promise((resolve, reject) =>
                jwt.verify(token, config.getSecret(), (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                })
            );
            const { userId } = z.object({
                userId: z.number()
            }).parse(data);
            const user = await this.userModel.findOne({
                where: { userId },
                include: [this.roleModel]
            });
            if (!user) {
                return null;
            }
            const { password, ...userData } = user.toJSON();
            return userData;
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                console.error("Error al verificar JWT: ", err);
            }
            return null;
        }
    }

    /**
     * Encuentra y retorna todos los usuarios.
     *
     */
    async findAll(): Promise<User[]> {
        const users = await this.userModel.findAll({
            attributes: {
                exclude: ["password"],
            },
            include: [this.roleModel]
        });
        return users;
    }

    /**
     * Encuentra y retorna un usuario por su ID
     */
    async findById(userId: number) {
        const user = await this.userModel.findByPk(userId, {
            include: [this.roleModel],
        });
        return user;
    }

    /**
     * Actualiza un usuario con datos parciales.
     */
    async updateByAdmin(userId: number, userData: UpdateUserByAdmin) {
        if ("password" in userData) {
            throw new InvalidDataError("No puedes actualizar la contraseña de otro usuario");
        }
        return this.updateUser(userId, userData);
    }

    /**
     * Actualiza un usuario con datos parciales.
     * Este servicio permite que un usuario actualice su propio perfil, 
     * incluyendo su contraseña.
     * 
     * **No** permite que cambie sus roles.
     */
    async updateProfile(userId: number, userData: UpdateUserData) {
        if ("roles" in userData) {
            throw new InvalidRoleError("No puedes asignarte un rol a ti mismo");
        }
        return this.updateUser(userId, userData);
    }

    private async updateUser(userId: number, userData: UpdateUserByAdmin | UpdateUserData) {
        const found = await this.userModel.findByPk(userId, {
            include: this.roleModel,
        });
        if (!found) {
            throw new UserNotFoundError("Usuario no encontrado.");
        }

        const otherUser = await this.userModel.findOne({
            where: {
                userId: { [Op.ne]: userId },
                [Op.or]: {
                    username: userData.username ?? "",
                    email: userData.email ?? "",
                },
            },
        });

        if (otherUser) {
            throw new ConflictingUserError("Nombre de usuario o email en uso");
        }


        if ("roles" in userData && userData.roles) {
            if (userData.roles.length === 0) {
                await this.userRoleModel.destroy({
                    force: true,
                    where: { userId }
                });
            } else {
                const roles = await this.roleModel.findAll({
                    where: { name: { [Op.or]: userData.roles } },
                });
                await found.$set("roles", roles);
            }

        }

        let password = found.password;
        if ("password" in userData && userData.password) {
            password = await this.encryptionService.encrypt(userData.password);
        }

        await found.update({
            email: userData.email,
            username: userData.username,
            password: password
        });

        // `updated` no contiene las asociaciones a #roleModel.
        // Debemos hacer otra consulta a Base de datos para obtenerlas.
        const user = await this.userModel.findByPk(userId, {
            include: this.roleModel,
        });
        if (!user) {
            throw new UserNotFoundError("Usuario no encontrado");
        }
        return user;
    }

    /**
     * Borra un usuario con el ID pasado
     */
    async delete(id: number) {
        const found = await this.userModel.findByPk(id);
        if (!found) return false;
        await found.destroy();
        return true;
    }

    async create(userData: CreateUserByAdmin) {
        const user = await this.userModel.findOne({
            where: {
                [Op.or]: {
                    username: userData.username,
                    email: userData.email,
                },
            },
        });

        if (user) {
            throw new ConflictingUserError(
                "Nombre de usuario o correo electrónico en uso"
            );
        }

        const signedUp = await this.userModel.create(
            {
                username: userData.username,
                password: await this.encryptionService.encrypt(userData.password),
                email: userData.email,
                roles: []
            },
            {
                attributes: {
                    exclude: ["password"],
                },
                include: this.roleModel,
            }
        );
        if (userData.roles && userData.roles.length !== 0) {
            const roles = await this.roleModel.findAll({
                where: { name: { [Op.or]: userData.roles } }
            });
            signedUp.$set("roles", roles)
        }

        return {
            user: signedUp,
        };
    }

    /**
     * Regístra un usuario con un rol de usuario 
     */
    async signUp(userData: CreateUserData) {
        const user = await this.userModel.findOne({
            where: {
                [Op.or]: {
                    username: userData.username,
                    email: userData.email,
                },
            },
        });

        if (user) {
            throw new ConflictingUserError(
                "Nombre de usuario o correo electrónico en uso"
            );
        }

        const signedUp = await this.userModel.create(
            {
                username: userData.username,
                password: await this.encryptionService.encrypt(userData.password),
                email: userData.email,
                roles: []
            },
            {
                attributes: {
                    exclude: ["password"],
                },
                include: this.roleModel,
            }
        );

        return {
            user: signedUp,
            token: await this.createTokenFor(signedUp),
        };
    }

    /**
     * Inicia sesión a un usuario existente
     *
     * @param {{
     *    username: string,
     *    password: string,
     * }} userData
     */
    async signIn(userData: SignInData) {
        const found = await this.userModel.findOne({
            where: { username: userData.username },
            include: this.roleModel,
        });

        if (!found) {
            throw new InvalidSignInError("Usuario o contraseña no válida");
        }

        const passwordsMatches = await this.encryptionService.compare(
            userData.password,
            found.password
        );

        if (!passwordsMatches) {
            throw new InvalidSignInError("Usuario o contraseña no válida");
        }

        const { password, ...rest } = found.toJSON();
        return {
            user: rest,
            token: await this.createTokenFor(found)
        };
    }

    /**
     * Verifica si el usuario tiene el un rol con el nombre
     * dado por el parámetro `role`
     */
    async matchesRole(user: User, roleName: RoleName) {
        const role = await this.roleModel.findOne({
            where: { name: roleName },
        });
        if (!role) {
            console.warn(
                "Rol no encontrado pasado a `matchesRole`. Este es un error lógico."
            );
            return false;
        }

        return role.$has("users", user.userId)
    }
}

export const usersService = new UsersService(
    User,
    Role,
    encryptionService,
    UserRole
);