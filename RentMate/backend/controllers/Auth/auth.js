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
        // Step 1: Find the user by email
        const user = await User.findOne({ email: req.body.email }).lean();
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Invalid credentials"));

        const accessToken = jwt.sign(
            {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30m" } 
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" } 
        );

        await User.findByIdAndUpdate(user._id, { refreshToken });


        res.status(200).json({ access_token: accessToken , refresh_token: refreshToken });
    } catch (err) {
        next(err);
    }
};


export const refreshToken = async (req, res, next) => {
    try {
        const token = req.body.refresh_token;
        if (!token) return res.status(403).json({ message: 'No refresh token provided' });

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] });
        if (!decoded) return res.status(403).json({ message: 'Invalid refresh token' });

        const user = await User.findById(decoded.id).lean();
        if (!user || user.refreshToken !== token) {
            console.log(`User not found or token mismatch: ${user ? user.refreshToken : 'No user found'}`);
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30m', algorithm: 'HS256' } // Specify the algorithm
        );

        res.status(200).json({ access_token: newAccessToken });
    } catch (err) {
        console.error('Error refreshing token:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res, next) => {
    try {
        // Clear refresh token from the database
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.sendStatus(204); // No content, already logged out

        // Find the user with the refresh token
        const user = await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null }
        );
        
        if (!user) return res.sendStatus(204);

        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
};




