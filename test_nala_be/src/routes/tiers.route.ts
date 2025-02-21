import { Router, Request, Response } from 'express';
import * as TierServices from '../services/tiers.service';

const router = Router();


router.post('/', async (req: Request, res: Response) => {
    try {
        const tier = await TierServices.createTier(req.body);
        res.status(201).json(tier);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el tier' });
    }
});

router.get('/', async (_req: Request, res: Response) => {
    try {
        const tiers = await TierServices.getTiers();
        res.status(200).json(tiers);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tiers' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tier = await TierServices.getTierById(id);
        res.status(200).json(tier);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el tier' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const updatedTier = await TierServices.updateTier(id, title);
        res.status(200).json(updatedTier);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el tier.' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await TierServices.deleteTier(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tier.' });
    }
});

export default router;