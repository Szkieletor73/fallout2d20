import type { PageLoad } from "./$types";
import weapons from "$lib/assets/item-data/guns.json";
import mods from "$lib/assets/item-data/mods.json";
import type { SelectOption } from "$lib/interfaces";
import { WeaponType, type Weapon, type WeaponMod } from "./interfaces";

function parseWeaponOptions(input: Array<Weapon>): Array<SelectOption> {
    const output: Array<SelectOption> = []
    
    input.forEach(weapon => {
        const option: SelectOption = {
            label: weapon.name,
            value: weapon.id
        }

        const groupIndex: number = output.findIndex(x => x.value == weapon.type)
        if (groupIndex >= 0) {
            output.splice(groupIndex, 0, option)
        } else {
            output.push({
                label: WeaponType[weapon.type as keyof typeof WeaponType],
                value: weapon.type,
                disabled: true,
                groupLabel: true
            })
            output.unshift(option)
        }
    });
    return output.reverse()
}

function parseModOptions(input: Array<WeaponMod>): Array<SelectOption> {
    const output: Array<SelectOption> = []

    input.forEach(mod => {
        const option: SelectOption = {
            label: mod.name,
            value: mod.id
        }
        output.push(option)
    });

    return output
}

export const load: PageLoad = () => {
    return {
        weaponOptions: parseWeaponOptions(weapons as unknown as Array<Weapon>),
        modOptions: parseModOptions(mods as unknown as Array<WeaponMod>),
        itemData: { weapons: weapons as unknown as Array<Weapon>, mods: mods as unknown as Array<WeaponMod> }
    };
};