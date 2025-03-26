export const POKEMON_NATURES: string[] = [
    'Adamant (+Atk, -SpA)',
    'Bashful (Neutral)',
    'Bold (+Def, -Atk)',
    'Brave (+Atk, -Spe)',
    'Calm (+SpD, -Atk)',
    'Careful (+SpD, -SpA)',
    'Docile (Neutral)',
    'Gentle (+SpD, -Def)',
    'Hardy (Neutral)',
    'Hasty (+Spe, -Def)',
    'Impish (+Def, -SpA)',
    'Jolly (+Spe, -SpA)',
    'Lax (+Def, -SpD)',
    'Lonely (+Atk, -Def)',
    'Mild (+SpA, -Def)',
    'Modest (+SpA, -Atk)',
    'Naive (+Spe, -SpD)',
    'Naughty (+Atk, -SpD)',
    'Quiet (+SpA, -Spe)',
    'Quirky (Neutral)',
    'Rash (+SpA, -SpD)',
    'Relaxed (+Def, -Spe)',
    'Sassy (+SpD, -Spe)',
    'Serious (Neutral)',
    'Timid (+Spe, -Atk)'
];

export const EV_TOTAL_MAX: number = 510;
export const EV_MAX: number = 252;
export const IV_MAX: number = 31;
export const IV_MIN: number = 0;


export const POKEMON_TYPES: string[] = [
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
    'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];


export const POKEMON_TIERS: string[] = [
    'Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC', 'NFE'
];


export const ALL_POKEMON_TIERS: string[] = [
    'Uber', 'UUBL', 'OU', 'RUBL', 'UU', 'NUBL', 'RU', 'PUBL', 'NU', 'PU', 'LC', 'NFE'
];

// Tier groupings for filtering purposes
export const TIER_GROUPS: { [key: string]: string[] } = {
    'Uber': ['Uber'],
    'OU': ['OU', 'UUBL'],
    'UU': ['UU', 'RUBL'],
    'RU': ['RU', 'NUBL'],
    'NU': ['NU', 'PUBL'],
    'PU': ['PU'],
    'LC': ['LC'],
    'NFE': ['NFE']
};

export const TIER_DISPLAY_NAMES: { [key: string]: string } = {
    'Uber': 'Uber',
    'UUBL': 'OU Borderline',
    'OU': 'OverUsed',
    'RUBL': 'UU Borderline',
    'UU': 'UnderUsed',
    'NUBL': 'RU Borderline',
    'RU': 'RarelyUsed',
    'PUBL': 'NU Borderline',
    'NU': 'NeverUsed',
    'PU': 'PU',
    'LC': 'Little Cup',
    'NFE': 'Not Fully Evolved'
};

export const ITEM_CATEGORIES: string[] = [
    'Hold Items', 'Consumables', 'Battle Items', 'Miscellaneous']