import mongoose, { Schema, Document, Types } from 'mongoose';

interface ICardNode extends Document {
  id: number;
  title: string;
  children: Types.ObjectId[];
  root?: boolean;
}

const CardNodeSchema = new Schema<ICardNode>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  children: [{ type: Schema.Types.ObjectId, ref: 'CardNode' }],
  root: { type: Boolean, default: false },
});

const CardNode = mongoose.model<ICardNode>('CardNode', CardNodeSchema);
export default CardNode;
