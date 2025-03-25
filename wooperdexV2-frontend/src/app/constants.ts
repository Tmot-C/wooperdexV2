export const POKEMON_NATURES: string[] = [
    'Adamant',
    'Bashful',
    'Bold',
    'Brave',
    'Calm',
    'Careful',
    'Docile',
    'Gentle',
    'Hardy',
    'Hasty',
    'Impish',
    'Jolly',
    'Lax',
    'Lonely',
    'Mild',
    'Modest',
    'Naive',
    'Naughty',
    'Quiet',
    'Quirky',
    'Rash',
    'Relaxed',
    'Sassy',
    'Serious',
    'Timid'
];

export const EV_TOTAL_MAX: number = 510;
export const EV_MAX: number = 252;
export const IV_MAX: number = 31;


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