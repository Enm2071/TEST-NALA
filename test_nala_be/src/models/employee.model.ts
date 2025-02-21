import mongoose, { Schema, Document, Types } from 'mongoose';

interface IEmployee extends Document {
  name: string;
  node: Types.ObjectId;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  node: { type: Schema.Types.ObjectId, ref: 'CardNode', required: true },
});

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export default Employee;
