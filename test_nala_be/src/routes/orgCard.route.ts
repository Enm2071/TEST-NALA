import { Router, Request, Response } from 'express';
import * as orgCardServices from '../services/orgCard.service';

const router = Router();

/**
 * Crear un nuevo nodo
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const node = await orgCardServices.createNode(req.body);
        res.status(201).json(node);
    } catch (error) {
        console.error('Error al crear nodo:', error);
        res.status(500).json({ error: 'Error al crear el nodo' });
    }
});

/**
 * Obtener todos los nodos
 */
router.get('/', async (_req: Request, res: Response) => {
    try {
        const nodes = await orgCardServices.getAllNodes();
        res.status(200).json(nodes);
    } catch (error) {
        console.error('Error al obtener nodos:', error);
        res.status(500).json({ error: 'Error al obtener los nodos' });
    }
});

/**
 * Actualizar un nodo por ID
 */
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const node = await orgCardServices.updateNode(req.params.id, req.body);
        res.status(200).json(node);
    } catch (error) {
        console.error('Error al actualizar nodo:', error);
        res.status(500).json({ error: 'Error al actualizar el nodo' });
    }
});

export default router;
