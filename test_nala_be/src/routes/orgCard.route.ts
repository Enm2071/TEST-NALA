import { Router, Request, Response } from 'express';
import * as orgCardServices from '../services/orgCard.service';
import mongoose from 'mongoose';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const node = await orgCardServices.createNode(req.body);
    res.status(201).json(node);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el nodo' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const nodes = await orgCardServices.getAllNodes();
    res.status(200).json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los nodos' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedNodeData = req.body[0];
    const { id } = req.params;

    if (!updatedNodeData || typeof updatedNodeData !== 'object') {
      throw new Error('Datos de nodo no válidos.');
    }

    updatedNodeData._id = new mongoose.Types.ObjectId(id);

    const updatedNode = await orgCardServices.replaceNode(id, updatedNodeData);

    if (!updatedNode) {
      throw new Error('Nodo no encontrado.');
    }

    res.status(200).json(updatedNode);
  } catch (error) {
    res.status(500).json({ error: 'Error al reemplazar el nodo.' });
  }
});

router.put('/:id/:title', async (req: Request, res: Response) => {
  try {
    const { id, title } = req.params;

    const updatedNode = await orgCardServices.updateNodeTitle(id, title);

    if (!updatedNode) {
      throw new Error('Nodo no encontrado.');
    }

    res.status(200).json(updatedNode);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el título del nodo.' });
  }
});

router.put('/add/description/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    await orgCardServices.updateNodeDescription(id, description);
    res.status(200).json({ message: 'Descripción actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la descripción del nodo.' });
  }
});
 
router.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    const nodeId = req.params.id;

    const deleteNodeAndChildren = async (nodeId: string) => {
      const node = await orgCardServices.getNodeById(nodeId);
      if (!node) return;

      await Promise.all(node.children.map(child => deleteNodeAndChildren(child._id.toString())));

      await orgCardServices.findByIdAndDelete(nodeId);
    };

    await deleteNodeAndChildren(nodeId);

    res.status(200).json({ message: 'Nodo y sus hijos eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el nodo' });
  }
});


export default router;
