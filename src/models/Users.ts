import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    id: string,
    username: string,
    email: string,
    password: string,
    _doc?: IUser
};

type UModel = Omit<IUser, "id">;
const UserSchema = new mongoose.Schema<UModel>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>("User", UserSchema);


