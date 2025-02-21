import Tiers from '../models/tiers.model';

export const createTier = async (data: {
    title: string;
    level: number;
}) => {

    const newTier = {
        title: data.title,
        level: data.level
    }
    console.log('newTier', newTier);
    const tier = new Tiers(newTier);

    return await tier.save();
}

export const getTiers = async () => {
    return await Tiers.find();
}

export const getTierById = async (id: string) => {
    return await Tiers.findById(id);
}

export const updateTier = async (id: string, title: string) => {
    return await Tiers.findByIdAndUpdate(id, { title }, { new: true });
}

export const deleteTier = async (id: string) => {
    return await Tiers.findByIdAndDelete(id);
}