import CardNode from '../models/orgCard.model';
import { Types } from 'mongoose';

export const createNode = async (data: { id: number; title: string; children?: Types.ObjectId[] }) => {
  const node = new CardNode(data);
  return await node.save();
};


export const getAllNodes = async () => {
  return await CardNode.find().populate('children').where('root').equals(true);
};


export const getNodeById = async (id: string) => {
  return await CardNode.findById(id).populate('children');
};

export const replaceNode = async (id: string, newData: any) => {
  try {
    const childNodes = await Promise.all(
      newData.children.map(async (child: any) => {
        if (!child._id) {
          const newChild = new CardNode(child);
          await newChild.save();
          return newChild._id;
        }
        return new Types.ObjectId(child._id);
      })
    );

    return await CardNode.findOneAndReplace(
      { _id: new Types.ObjectId(id) },
      { ...newData, children: childNodes },
      { new: true }
    );
  } catch (error) {
    console.error('❌ Error al reemplazar nodo:', error);
    throw error;
  }
};

export const deleteNode = async (id: string) => {
  return await CardNode.findByIdAndDelete(id);
};
