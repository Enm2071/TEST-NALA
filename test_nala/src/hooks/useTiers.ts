import { useEffect, useState } from "react";
import { API_URL } from "../libs/config";
import { useToastify } from "./useToastify";

type Tiers = {
    _id: string;
    title: string;
    level: number;
}


const useTiers = () => {
    const [tierNames, setTierNames] = useState<Tiers[]>([{ _id: '', title: 'Tier 1', level: 0 }]);
    const [editingTier, setEditingTier] = useState<number | null>(null);
    const { notifyError } = useToastify();
    console.log('tierNames', tierNames);
    function getTierTitle(level: number) {
        console.log('lvl name', level, tierNames[level]?.title, tierNames[level]?.title ?? `Tier ${level}`);
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

    function handleTierNameChange(level: number, newName: string) {
        const tier = tierNames.find(tier => tier.level === level);
        if (!tier) {
            console.log('no created');
            setTierNames([...tierNames, { _id: '', title: newName, level }]);
            return;
        }
        setTierNames(tierNames.map(tier => {
            if (tier.level === level) {
                console.log('tier inside', tier);
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