import User from "../../models/Users/user.js";
import bcrypt from "bcrypt";
import createError from "http-errors";
import jwt from "jsonwebtoken";

//for register
export const register = async (req, res, next) => {
    try{

        //To encrypt the password
        const salt = bcrypt.genSaltSync(18);
        const hash = bcrypt.hashSync(req.body.password, salt);


        const newuser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            type: req.body.type
        });
        await newuser.save();
        res.status(201).send("User has Been created");

    }catch(err){
        next(err);
    }

}

// for login
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, "Invalid credentials"));

        // const token = await jwt.sign({ user }, process.env.JWT_SECRET);

        const token = await jwt.sign(
            {
              id: user._id,
              fname: user.fname,
              lname: user.lname,
              email: user.email,
              role: user.role,
            },
            process.env.JWT_SECRET,
            //expires in 1 min
            { expiresIn: "1m" }
          );
        
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};





