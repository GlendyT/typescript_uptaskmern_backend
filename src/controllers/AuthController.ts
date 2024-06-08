import type { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email} = req.body

            //TODO: PREVENIR DUPLICADOS
            const userExists = await User.findOne({email})
            if(userExists) {
                const error = new Error("El usuario ya esta registrado")
                return res.status(409).json({error: error.message})
            }
            const user = new User(req.body)

            //TODO:HASH PASSWORD
            user.password = await hashPassword(password)
            await user.save()

            res.send("Cuenta creada, revisa tu email para confirmarl ")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    }
}