export enum WeaponType {
    Small = "Small Guns",
    Big = "Big Guns",
    Energy = "Energy Weapons",
    Melee = "Melee Weapons",
    Unarmed = "Unarmed"
}

export enum DamageType {
    Physical = "Physical",
    Energy = "Energy",
    Radiation = "Radiation",
    Poison = "Poison",
    Special = "Special"
}

export enum GunRange {
    C,
    M,
    L,
    E
}

export enum WeaponModSlot {
    Receiver = "Receiver",
    Barrel = "Barrel",
    Grip = "Grip",
    Sights = "Sights",
    Magazine = "Magazine",
    Stock = "Stock",
    Muzzle = "Muzzle"
}

export interface DamageEffect {
    id: string,
    name: string,
    description: string
}

export interface WeaponQuality {
    id: string,
    name: string,
    description: string,
    incompatible?: string,
}

export interface Perk {
    id: string,
    name: string,
    description: string,
    rank: number
}

export interface Weapon {
    id: string,
    name: string,
    ammo: string,
    type: WeaponType,
    damageRating: number,
    damageEffects: Array<DamageEffect>,
    damageType: DamageType,
    firerate: number | null,
    range: GunRange | null,
    qualities: Array<WeaponQuality>,
    weight: number,
    cost: number,
    rarity: number,
    compatibleMods: {
        Receiver?: Array<string>,
        Barrel?: Array<string>,
        Magazine?: Array<string>,
        Grip?: Array<string>,
        Sights?: Array<string>,
        Stock?: Array<string>,
        Muzzle?: Array<string>
    }
}

export interface WeaponMod {
    id: string,
    name: string,
    namePrefix?: string,
    type: WeaponType,
    slot: WeaponModSlot,
    damageMod?: number,
    damageSet?: number,
    firerateMod?: number,
    firerateSet?: number,
    rangeMod?: number,
    rangeSet?: number,
    weightMod?: number,
    costMod?: number,
    ammoSet?: string,
    perks?: Array<Perk>,
    qualities?: {
        added?: Array<WeaponQuality>,
        removed?: Array<WeaponQuality>
    }
}