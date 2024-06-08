import type { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"

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

            //TODO: GENERAR EL TOKEN
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //TODO: ENVIAR EMAIL
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })


            await Promise.allSettled([user.save(), token.save()])
            res.send("Cuenta creada, revisa tu email para confirmarl ")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExist = await Token.findOne({token})

            if(!tokenExist) {
                const error = new Error("Token no valido")
                return res.status(401).json({error: error.message})
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([ user.save(), tokenExist.deleteOne()])
            res.send("Cuenta confirmada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    }
}