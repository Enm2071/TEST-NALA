import CardNode from '../models/orgCard.model';
import { Types } from 'mongoose';

export const createNode = async (data: { id: number; title: string; children?: Types.ObjectId[] }) => {
  const node = new CardNode(data);
  return await node.save();
};


export const getAllNodes = async () => {
  async function populateChildren(node: any) {
    await node.populate('children');
    await Promise.all(node.children.map(populateChildren)); // Población recursiva
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
    // Función recursiva para guardar todos los hijos y sus descendientes
    const saveChildrenRecursively = async (nodes: any[]): Promise<Types.ObjectId[]> => {
      return await Promise.all(
        nodes.map(async (node: any) => {
          if (!node._id) {
            // Si el nodo no tiene _id, creamos un nuevo nodo y guardamos sus hijos también
            const newNode = new CardNode({
              ...node,
              children: await saveChildrenRecursively(node.children || [])
            });
            await newNode.save();
            return newNode._id;
          } else {
            // Si el nodo ya existe, actualizamos sus hijos recursivamente
            await CardNode.findByIdAndUpdate(node._id, {
              children: await saveChildrenRecursively(node.children || [])
            });
            return new Types.ObjectId(node._id);
          }
        }) as any
      );
    };

    // Guardamos todos los hijos antes de actualizar el nodo raíz
    const childNodes = await saveChildrenRecursively(newData.children || []);

    // Reemplazamos el nodo con los nuevos datos y los hijos actualizados
    await CardNode.findOneAndReplace(
      { _id: new Types.ObjectId(id) },
      { ...newData, children: childNodes },
      { new: true }
    );

    // Función recursiva para poblar todos los niveles de hijos
    const populateChildrenRecursively = async (node: any) => {
      await node.populate('children');
      await Promise.all(node.children.map(populateChildrenRecursively)); // Poblar recursivamente
      return node;
    };

    // Buscar el nodo actualizado y poblar todos los niveles de hijos
    const updatedNode = await CardNode.findById(id);
    return await populateChildrenRecursively(updatedNode);

  } catch (error) {
    console.error('❌ Error al reemplazar nodo:', error);
    throw error;
  }
};



export const deleteNode = async (id: string) => {
  return await CardNode.findByIdAndDelete(id);
};

export const findByIdAndDelete = async (id: string) => {
  return await CardNode.findByIdAndDelete(id);
}
