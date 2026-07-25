import Admin from "../models/adminModel.js"
import bcrypt from "bcrypt"
const signUp = async (req, res) => {
    try {
        const { email, password, contact, name } = req.body;
        const hash = await bcrypt.hash(password, 12);
        const result = await Admin.create({ name, email, contact, password: hash });
        res.status(200).json({
            status: true,
            message: "admin SigUp succesfully !!",
            result
            
            })
    }
    catch (err) {
        res.json({
            status: false,
            message: "admin SignUp failed !!",
            err:err.message
        })
    }
}

export const signIn = async (req, res) => {
    try {
        const result = await Admin.findOne({email: req.body.email});

    }
    catch (err) {
        res.json({
            status: false,
            message: "admin SignIn failed !!",
            err: err.message
        })
    }
}