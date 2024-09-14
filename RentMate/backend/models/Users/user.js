import mongoose  from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    refreshToken: { 
        type: String,
        default: null
    }
},
    {timeseries: true}
)
const User = mongoose.model('Users', UserSchema);

export default User;