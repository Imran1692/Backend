import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema = new Schema({
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
            type:Schema.types.objectId,
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
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.ispasswordCorrect = async function (password){
return await bcrypt.compare(password,this.password)
}

userSchema.mathods.generateAccessToken = function () {
   return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.mathods.generateRefreshToken = function (){
       return jwt.sign(
        {
            _id:this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)