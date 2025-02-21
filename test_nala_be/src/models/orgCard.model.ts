import mongoose, { Schema, Document, Types } from 'mongoose';

interface ICardNode extends Document {
  id: number;
  title: string;
  children: Types.ObjectId[];
}

const CardNodeSchema = new Schema<ICardNode>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  children: [{ type: Schema.Types.ObjectId, ref: 'CardNode' }]
});

const CardNode = mongoose.model<ICardNode>('CardNode', CardNodeSchema);

export default CardNode;
