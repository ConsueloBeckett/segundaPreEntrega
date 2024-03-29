import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import {dirname} from 'path'


export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(user.password, password)


const PRIVATE_KEY = 'coderJsonWebToken'

export const generateToken =(user)=>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'})
   return token
}

export const authToken = ( req, res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).send({
        e: 'Notauthorized'
    })
 
 const token = authHeader.split('')[1]

jwt.verify(token, PRIVATE_KEY,(error, credential)=>{
    if(e) return res.status(403).send({e: 'not authorized'})
    req.user = credential.user
    next()
})



}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname