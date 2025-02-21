import Employee from '../models/employee.model';
import mongoose from 'mongoose';

export const createEmployee = async (name: string, nodeId: string) => {
  const employee = new Employee({ name, node: new mongoose.Types.ObjectId(nodeId) });
  return await employee.save();
};

export const getEmployeeById = async (id: string) => {
  return await Employee.findById(id).populate('node');
};

export const getEmployeesByNode = async (nodeId: string) => {
  return await Employee.find({ node: new mongoose.Types.ObjectId(nodeId) }).populate('node');
};

export const getAllEmployees = async () => {
  return await Employee.find().populate('node');
};

export const updateEmployee = async (id: string, updateData: any) => {
  return await Employee.findByIdAndUpdate(id, updateData, { new: true }).populate('node');
};

export const deleteEmployee = async (id: string) => {
  return await Employee.findByIdAndDelete(id);
};
