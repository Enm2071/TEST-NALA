import Tiers from '../models/tiers.model';

export const createTier = async (data: { 
    title: string;
    level: number;  
}) => {
    const tier = new Tiers({
        title: data.title,
        level: data.level
    });
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