import mongoose, { Schema } from "mongoose";


interface ITier extends Document {
    title: string;
    level: number;
}

const TierSchema = new Schema<ITier>({
    title: { type: String, required: true, unique: true },
    level: { type: Number, required: true }
});

const Tier = mongoose.model<ITier>('Tier', TierSchema);
export default Tier;
