import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists:username,email
    // check for image, avater
    // upload them to cloudinary, avtar
    // create user object - create entry in bd 
    // remove password and refresh token field from response 
    // check for user creration
    // return res





    const { fullName, email, username, password } = req.body
    console.log("email:", email);

    if (
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"all fields are require")        
    }


    const existedUser = User.findOne({
        $or:[{ username },{ email }]
    })

    if (existedUser) {
        throw new ApiError(409,"user with email or username already exists")
    }

    const avatarLocalPath = req.field?.avtar[0]?.path;
    const coverImageLocalPath = req.field?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar file is require")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"avatar file is require")
    }


   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || " ",
        password,
        username: username.toLwerCase()
    })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )


   if (createdUser) {
    throw new ApiError(500,"something went wrong while registering the user")
   }


   return res.status(201).json(
    new ApiResponse( 200, createdUser,"user registered successfully" )
   )
})

export { registerUser }