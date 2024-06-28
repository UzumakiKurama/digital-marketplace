import { z } from 'zod';


export const AuthCredentialsValidator = z.object({
    email : z.string().email(),
    password : z.string().min(8, {
        message : "Password length must be greated than 8"
    })
  })

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>
