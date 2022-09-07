import mongoose from "mongoose";

export interface ITodo extends mongoose.Document {
    text: string,
    user: mongoose.Schema.Types.ObjectId
};

const TodoSchema = new mongoose.Schema<ITodo>({
    text: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const TodoModel = mongoose.model<ITodo>("Todo", TodoSchema);


