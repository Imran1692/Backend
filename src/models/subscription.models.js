import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema ({
    subscriber: {
        type: Schema.Types.ObjectId, //one who is Subscribing
        ref: "User"
    },
    chennel: {
        type : Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        ref: "User"
    }

},{timestamps : true})


export const subscriptionSchema = mongoose.model("subscription",subscriptionSchema)