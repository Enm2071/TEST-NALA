import CardNode from '../models/orgCard.model';
import { Types } from 'mongoose';

/**
 * Crear un nuevo nodo
 * @param data Datos del nodo a crear
 * @returns Nodo creado
 */
export const createNode = async (data: { id: number; title: string; children?: Types.ObjectId[] }) => {
  const node = new CardNode(data);
  return await node.save();
};

/**
 * Obtener todos los nodos
 * @returns Lista de nodos con sus hijos
 */
export const getAllNodes = async () => {
  return await CardNode.find().populate('children');
};

/**
 * Obtener un nodo por su ID
 * @param id ID del nodo
 * @returns Nodo encontrado o null si no existe
 */
export const getNodeById = async (id: string) => {
  return await CardNode.findById(id).populate('children');
};

/**
 * Actualizar un nodo por su ID
 * @param id ID del nodo
 * @param data Datos a actualizar (título o hijos)
 * @returns Nodo actualizado o null si no existe
 */
export const updateNode = async (id: string, data: { title?: string; children?: Types.ObjectId[] }) => {
  return await CardNode.findByIdAndUpdate(id, data, { new: true }).populate('children');
};

/**
 * Eliminar un nodo por su ID
 * @param id ID del nodo
 * @returns Nodo eliminado o null si no existe
 */
export const deleteNode = async (id: string) => {
  return await CardNode.findByIdAndDelete(id);
};
