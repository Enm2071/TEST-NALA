import CardNode from '../models/orgCard.model';
import { Types } from 'mongoose';

export const createNode = async (data: { id: number; title: string; children?: Types.ObjectId[] }) => {
  const node = new CardNode(data);
  return await node.save();
};

export const getAllNodes = async () => {
  async function populateChildren(node: any) {
    await node.populate('children');
    await Promise.all(node.children.map(populateChildren));
    return node;
  }

  const rootNodes = await CardNode.find().where('root').equals(true);
  await Promise.all(rootNodes.map(populateChildren));

  return rootNodes;
};

export const getNodeById = async (id: string) => {
  return await CardNode.findById(id).populate('children');
};

export const replaceNode = async (id: string, newData: any) => {
  try {
    const saveChildrenRecursively = async (nodes: any[]): Promise<Types.ObjectId[]> => {
      return await Promise.all(
        nodes.map(async (node: any) => {
          if (!node._id) {
            const newNode = new CardNode({
              ...node,
              children: await saveChildrenRecursively(node.children || [])
            });
            await newNode.save();
            return newNode._id;
          } else {
            await CardNode.findByIdAndUpdate(node._id, {
              children: await saveChildrenRecursively(node.children || [])
            });
            return new Types.ObjectId(node._id);
          }
        }) as any
      );
    };

    const childNodes = await saveChildrenRecursively(newData.children || []);

    await CardNode.findOneAndReplace(
      { _id: new Types.ObjectId(id) },
      { ...newData, children: childNodes },
      { new: true }
    );

    const populateChildrenRecursively = async (node: any) => {
      await node.populate('children');
      await Promise.all(node.children.map(populateChildrenRecursively));
      return node;
    };
    const updatedNode = await CardNode.findById(id);
    return await populateChildrenRecursively(updatedNode);

  } catch (error) {
    throw error;
  }
};

export const updateNodeTitle = async (id: string, title: string) => {
  return await CardNode.findByIdAndUpdate(id, { title }, { new: true });
}

export const updateNodeDescription = async (id: string, description: string) => {
  return await CardNode.findByIdAndUpdate(id, { description }, { new: true });
}

export const deleteNode = async (id: string) => {
  return await CardNode.findByIdAndDelete(id);
};

export const findByIdAndDelete = async (id: string) => {
  return await CardNode.findByIdAndDelete(id);
}
