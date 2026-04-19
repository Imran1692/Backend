import mongoose,{Schema} from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema = new schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        index:true
    }, 
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:schema.types.objectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshToken:{
        type:String
    },
},
 {
        timestamps:true
    }
)
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})

userSchema.mathods.ispasswordCorrect = async function (password){
return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User",userSchema)