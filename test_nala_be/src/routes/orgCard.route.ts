import { Router, Request, Response } from 'express';
import * as orgCardServices from '../services/orgCard.service';
import mongoose from 'mongoose';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const node = await orgCardServices.createNode(req.body);
        res.status(201).json(node);
    } catch (error) {
        console.error('Error al crear nodo:', error);
        res.status(500).json({ error: 'Error al crear el nodo' });
    }
});

router.get('/', async (_req: Request, res: Response) => {
    try {
        const nodes = await orgCardServices.getAllNodes();
        res.status(200).json(nodes);
    } catch (error) {
        console.error('Error al obtener nodos:', error);
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
      console.error('❌ Error al reemplazar el nodo:', error);
      res.status(500).json({ error: 'Error al reemplazar el nodo.' });
    }
  });

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedNode = await orgCardServices.deleteNode(id);

        if (!deletedNode) {
            throw new Error('Nodo no encontrado.');
        }

        res.status(200).json(deletedNode);
    } catch (error) {
        console.error('❌ Error al eliminar el nodo:', error);
        res.status(500).json({ error: 'Error al eliminar el nodo.' });
    }
})

export default router;
