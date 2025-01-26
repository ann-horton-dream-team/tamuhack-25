import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        clerkId: String,
        first_name: String,
        last_name: String,
        email: String,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", schema);

export default User;