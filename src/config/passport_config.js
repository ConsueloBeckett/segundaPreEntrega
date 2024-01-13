import passport  from 'passport'
import local  from 'passport-local'
import createHash from '../utils.js'
import isValidPassword from '../utils.js'
import userService from '../models/User.js'


const  localStrategy =local.Strategy

const initializePassport = () => {
 passport.serializeUser((user, done)=>{
    done(null, user.id)
 })
 passport.deserializeUser(async(id, done)=>{
    let user = await userService.findByid(id)
    done(null,user)
 })



}

export default initializePassport