import { useEffect, useState } from "react";
import { API_URL } from "../libs/config";
import { useToastify } from "./useToastify";

type Tiers = {
    _id: string;
    title: string;
    level: number;
}


const useTiers = (numLevels: number) => {
    const [tierNames, setTierNames] = useState<Tiers[]>([{ _id: '', title: 'Tier 1', level: 0 }]);
    const [editingTier, setEditingTier] = useState<number | null>(null);
    const { notifyError } = useToastify();
    function getTierTitle(level: number) {
        const tier = tierNames.find(tier => tier.level === level);
        return tier?.title ?? `Tier ${level}`;
    }

    useEffect(() => {
        const fetchTierNames = async () => {
            try {
                const response = await fetch(`${API_URL}/tiers`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                if (data.length === 0) {
                    return;
                }

                setTierNames(data);
            } catch (error) {
                console.error('❌ Error fetching tier names:', error);
                notifyError('Error fetching tier names.');
            }
        }
        fetchTierNames();
    }, []);

    useEffect(() => {
        if (numLevels === 0) return;
        const tiersLevels = tierNames.length;

        if (tiersLevels === numLevels) return;

        console.log('numLevels:', numLevels, tiersLevels);
        const removeTiers = async (level: number) => {
            const tier = tierNames.find(tier => tier.level === level);
            if (!tier) return;
            if (!tier._id) return;
            try {
                const response = await fetch(`${API_URL}/tiers/${tier._id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.status}`);
                }
            } catch (error) {
                console.error('❌ Error deleting tier:', error);
                notifyError('Error deleting tier.');

            }

        }

        if (numLevels < tiersLevels) {
            const lastTier = tierNames[tierNames.length - 1];
            removeTiers(lastTier.level);
            return;
        }


    }, [numLevels]);

    function handleTierNameChange(level: number, newName: string) {
        const tier = tierNames.find(tier => tier.level === level);
        if (!tier) {
            setTierNames([...tierNames, { _id: '', title: newName, level }]);
            return;
        }
        setTierNames(tierNames.map(tier => {
            if (tier.level === level) {
                return { ...tier, title: newName };
            }
            return tier;
        }
        ));
    }

    function handleStartEditingTier(level: number) {
        setEditingTier(level);
    }

    async function handleStopEditingTier() {
        if (editingTier === null) return
        const tier = tierNames.find(tier => tier.level === editingTier);
        if (!tier) return;
        const method = tier?._id ? 'PUT' : 'POST';
        try {
            const response = await fetch(`${API_URL}/tiers/${tier?._id}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tier),
            });

            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status}`);
            }

            setEditingTier(null);
        } catch (error) {
            console.error('❌ Error updating tier title:', error);
            notifyError('Error updating tier title.');
        }
    }

    return {
        tierNames,
        editingTier,
        getTierTitle,
        handleTierNameChange,
        handleStartEditingTier,
        handleStopEditingTier,
    };
};

export default useTiers;