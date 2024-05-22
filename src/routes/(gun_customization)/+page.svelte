<script lang="ts">
	import type { SelectOption } from "$lib/interfaces";
	import Dropdown from "$lib/ui/dropdown.svelte";
	import type { PageData } from "./$types";
	import GunOutline from "./gun-outline.svelte";
	import { WeaponModSlot, WeaponType, type DamageEffect, type Weapon, type WeaponMod, type WeaponQuality } from "./interfaces";
    import CombatDie from '$lib/ui/combat-die.svelte'

    export let data: PageData

    
    let selectedWeaponId: string
    let moddedWeapon: Weapon | undefined

    let selectedModIds = {
        Receiver: undefined,
        Barrel: undefined,
        Magazine: undefined,
        Grip: undefined,
        Sights: undefined,
        Stock: undefined,
        Muzzle: undefined
    }

    /**
     * Returns a list of available mods for a given weapon and slot, in the form of SelectOptions.
     * @param slot which slot are we filtering for?
     */
    function filterAvailableMods(weaponId: string, slot: WeaponModSlot): Array<SelectOption> {
        const weapon = resolveWeapon(weaponId)

        const output: Array<SelectOption> = [
            {
                label: "Default",
                value: undefined
            }
        ]

        if (weapon) {
            data.itemData.mods.forEach(mod => {
                const modOption = data.modOptions.find(x => x.value === mod.id)
                if (
                    mod.type === weapon?.type
                    && mod.slot === slot
                    && weapon?.compatibleMods[slot]?.includes(mod.id)
                    && modOption
                ) {
                    output.push(modOption)
                }
            })
            
            // Clean up invalid selections
            if (!weapon.compatibleMods[slot]?.includes(selectedModIds[slot] || "")) {
                selectedModIds[slot] = undefined
            }
        }

        return output
    }

    /**
     * Takes a weapon ID and returns the full weapon object.
     * If a match cannot be found, defaults to the first entry in the list.
     * @param weaponId
     */
    function resolveWeapon(weaponId: string): Weapon {
        return data.itemData.weapons.find(x => x.id === weaponId) || data.itemData.weapons[0]
    }

    /**
     * Takes a mod ID, slot and type, and returns the full mod object.
     * @param modId
     * @param slot
     * @param type
     */
    function resolveMod(modId: string | undefined, slot: WeaponModSlot, type: WeaponType): WeaponMod | undefined {
        return data.itemData.mods.find(x => x.id === modId && x.slot == slot && x.type == type)
    }

    /**
     * Takes an effect ID, and returns the full effect object.
     * @param effectId
     */
    function resolveEffect(effectId: string): DamageEffect | undefined {
        return data.itemData.effects.find(x => x.id === effectId)
    }

    /**
     * Takes a quality ID, and returns the full quality object.
     * @param qualityId
     */
    function resolveQuality(qualityId: string): WeaponQuality | undefined {
        return data.itemData.qualities.find(x => x.id === qualityId)
    }

    // Trigger recalculation when anything in selections
    $: selectedWeaponId, selectedModIds, calculateModdedStats(selectedWeaponId)

    function reduceNumericStat(accumulator: number | undefined, current: number | undefined): number | undefined {
        if (accumulator !== undefined) {
            if (current !== undefined) {
                return accumulator + current
            } else {
                return accumulator
            }
        } else {
            return current
        }
    }
    /**
     * Recalculate stats of the final, modded weapon.
     * We're making some assumptions here. Only the receiver can SET ammo type and damage. All components can MOD damage and other stats.
     * No mods can modify Effects.
     * @param weaponId
     */
    function calculateModdedStats(weaponId: string) {
        const baseWeapon = resolveWeapon(weaponId)

        const selectedMods = {
            Receiver: resolveMod(selectedModIds.Receiver, WeaponModSlot.Receiver, baseWeapon.type),
            Barrel: resolveMod(selectedModIds.Barrel, WeaponModSlot.Barrel, baseWeapon.type),
            Magazine: resolveMod(selectedModIds.Magazine, WeaponModSlot.Magazine, baseWeapon.type),
            Grip: resolveMod(selectedModIds.Grip, WeaponModSlot.Grip, baseWeapon.type),
            Sights: resolveMod(selectedModIds.Sights, WeaponModSlot.Sights, baseWeapon.type),
            Stock: resolveMod(selectedModIds.Stock, WeaponModSlot.Stock, baseWeapon.type),
            Muzzle: resolveMod(selectedModIds.Muzzle, WeaponModSlot.Muzzle, baseWeapon.type)
        }

        console.log(selectedMods)
        
        moddedWeapon = {
            id: "modded",
            name: [
                selectedMods.Receiver?.namePrefix,
                selectedMods.Barrel?.namePrefix,
                selectedMods.Magazine?.namePrefix,
                selectedMods.Grip?.namePrefix,
                selectedMods.Sights?.namePrefix,
                selectedMods.Stock?.namePrefix,
                selectedMods.Muzzle?.namePrefix,
                baseWeapon.name
            ].join(' '),
            ammo: selectedMods.Receiver?.ammoSet || baseWeapon.ammo,
            type: baseWeapon.type,
            damageRating: baseWeapon.damageRating,
            damageEffects: [...baseWeapon.damageEffects],
            damageType: baseWeapon.damageType,
            firerate: baseWeapon.firerate,
            range: baseWeapon.range,
            qualities: [...baseWeapon.qualities],
            weight: baseWeapon.weight,
            cost: baseWeapon.cost,
            rarity: baseWeapon.rarity,
            compatibleMods: {}
        }

        moddedWeapon.damageRating = selectedMods.Receiver?.damageSet
            || [baseWeapon.damageRating,
                selectedMods.Receiver?.damageMod,
                selectedMods.Barrel?.damageMod,
                selectedMods.Magazine?.damageMod,
                selectedMods.Grip?.damageMod,
                selectedMods.Sights?.damageMod,
                selectedMods.Stock?.damageMod,
                selectedMods.Muzzle?.damageMod].reduce(reduceNumericStat)
            || baseWeapon.damageRating

        moddedWeapon.firerate = selectedMods.Receiver?.firerateSet
            || [baseWeapon.firerate,
                selectedMods.Receiver?.firerateMod,
                selectedMods.Barrel?.firerateMod,
                selectedMods.Magazine?.firerateMod,
                selectedMods.Grip?.firerateMod,
                selectedMods.Sights?.firerateMod,
                selectedMods.Stock?.firerateMod,
                selectedMods.Muzzle?.firerateMod].reduce(reduceNumericStat)
            || baseWeapon.firerate

        moddedWeapon.range = selectedMods.Receiver?.rangeSet
            || [baseWeapon.range,
                selectedMods.Receiver?.rangeMod,
                selectedMods.Barrel?.rangeMod,
                selectedMods.Magazine?.rangeMod,
                selectedMods.Grip?.rangeMod,
                selectedMods.Sights?.rangeMod,
                selectedMods.Stock?.rangeMod,
                selectedMods.Muzzle?.rangeMod].reduce(reduceNumericStat)
            || baseWeapon.range
        
            

        moddedWeapon.weight = [baseWeapon.weight,
                selectedMods.Receiver?.weightMod,
                selectedMods.Barrel?.weightMod,
                selectedMods.Magazine?.weightMod,
                selectedMods.Grip?.weightMod,
                selectedMods.Sights?.weightMod,
                selectedMods.Stock?.weightMod,
                selectedMods.Muzzle?.weightMod].reduce(reduceNumericStat)
            || baseWeapon.weight

        moddedWeapon.cost = [baseWeapon.cost,
                selectedMods.Receiver?.costMod,
                selectedMods.Barrel?.costMod,
                selectedMods.Magazine?.costMod,
                selectedMods.Grip?.costMod,
                selectedMods.Sights?.costMod,
                selectedMods.Stock?.costMod,
                selectedMods.Muzzle?.costMod].reduce(reduceNumericStat)
            || baseWeapon.cost

        Object.keys(selectedMods).forEach(slot => {
            let addedQualities: Array<string> | undefined = selectedMods[slot as keyof typeof selectedMods]?.qualities?.added
            if (addedQualities != undefined) {
                moddedWeapon?.qualities.push(...addedQualities)
            }
        });

        Object.keys(selectedMods).forEach(slot => {
            let removedQualities: Array<string> | undefined = selectedMods[slot as keyof typeof selectedMods]?.qualities?.removed
                if (removedQualities != undefined) {
                    removedQualities.forEach(quality => {
                        moddedWeapon?.qualities.splice(moddedWeapon?.qualities.findIndex(x => x === quality), 1)
                    });
                }
        });
        
        moddedWeapon.qualities = moddedWeapon.qualities.filter((value, index, array) => array.indexOf(value) === index)

        Object.keys(selectedMods).forEach(slot => {
            let addedEffects: Array<string> | undefined = selectedMods[slot as keyof typeof selectedMods]?.effects?.added
            if (addedEffects != undefined) {
                moddedWeapon?.damageEffects.push(...addedEffects)
            }
        });

        Object.keys(selectedMods).forEach(slot => {
            let removedEffects: Array<string> | undefined = selectedMods[slot as keyof typeof selectedMods]?.effects?.removed
                if (removedEffects != undefined) {
                    removedEffects.forEach(quality => {
                        moddedWeapon?.damageEffects.splice(moddedWeapon?.damageEffects.findIndex(x => x === quality), 1)
                    });
                }
        });
        
        // const piercingCount = moddedWeapon.damageEffects.filter(x => x.includes("piercing")).length
        // if (piercingCount > 0) {
        //     moddedWeapon.damageEffects = moddedWeapon.damageEffects.filter(x => !x.includes("piercing"))
        //     moddedWeapon.damageEffects.push(`piercing${piercingCount}`)
        // }
        // moddedWeapon.damageEffects = moddedWeapon.damageEffects.filter((value, index, array) => array.indexOf(value) === index)
    }

</script>

<h1 class="title">Gun Customization</h1>

<div class="container">
    <div class="gun-display">
        <GunOutline></GunOutline>
    </div>

    <div class="selector">
        <div class="selector-column">
            <label for="weapon">Weapon</label>
            <Dropdown name="weapon" bind:selected="{selectedWeaponId}" options="{data.weaponOptions}"></Dropdown>
        </div>

        <div class="selector-column">
            Mods
        </div>

        <div class="selector-column">
            <label for="receiver">Receiver/Capacitor</label>
            <Dropdown name="receiver" bind:selected="{selectedModIds.Receiver}" options="{filterAvailableMods(selectedWeaponId, WeaponModSlot.Receiver)}"></Dropdown>
            <div class="statgrid">
                <!-- {#if selected} -->
                    <div class="stat-label"></div>
                <!-- {/if} -->
            </div>
        </div>

        <div class="selector-column">
            <label for="barrel">Barrel</label>
            <Dropdown name="barrel" bind:selected="{selectedModIds.Barrel}" options="{filterAvailableMods(selectedWeaponId, WeaponModSlot.Barrel)}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="grip">Grip</label>
            <Dropdown name="grip" bind:selected="{selectedModIds.Grip}" options="{filterAvailableMods(selectedWeaponId, WeaponModSlot.Grip)}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="magazine">Magazine</label>
            <Dropdown name="magazine" bind:selected="{selectedModIds.Magazine}" options="{filterAvailableMods(selectedWeaponId, WeaponModSlot.Magazine)}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="sights">Sights</label>
            <Dropdown name="sights" bind:selected="{selectedModIds.Sights}" options="{filterAvailableMods(selectedWeaponId, WeaponModSlot.Sights)}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="stock">Stock</label>
            <Dropdown name="stock" bind:selected="{selectedModIds.Stock}" options="{filterAvailableMods(selectedWeaponId, WeaponModSlot.Stock)}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="muzzle">Muzzle</label>
            <Dropdown name="muzzle" bind:selected="{selectedModIds.Muzzle}" options="{filterAvailableMods(selectedWeaponId, WeaponModSlot.Muzzle)}"></Dropdown>
        </div>
    </div>

    <div class="stats">
        <div class="stats-base">
            <h4>Weapon Base Stats</h4>
            <div class="statgrid">
                <div class="stat-label">Name</div> <div>{resolveWeapon(selectedWeaponId).name}</div>

                <div class="stat-label">Ammunition</div> <div>{resolveWeapon(selectedWeaponId).ammo}</div>

                <div class="stat-label">Type</div> <div>{resolveWeapon(selectedWeaponId).type}</div>

                <div class="stat-label">Damage Rating</div> <div>{resolveWeapon(selectedWeaponId).damageRating} <CombatDie></CombatDie></div>

                <div class="stat-label">Damage Effects</div>
                {#if resolveWeapon(selectedWeaponId).damageEffects.length > 0}
                    <div>
                        {#each resolveWeapon(selectedWeaponId).damageEffects as effect, index}
                        <span>{resolveEffect(effect)?.name}</span>{#if index < resolveWeapon(selectedWeaponId).damageEffects.length - 1} <span>, </span>{/if}
                        {/each}
                    </div>
                {:else}
                    <div>
                        -
                    </div>
                {/if}

                <div class="stat-label">Damage Type</div> <div>{resolveWeapon(selectedWeaponId).damageType}</div>

                <div class="stat-label">Fire Rate</div> <div>{resolveWeapon(selectedWeaponId).firerate}</div>

                <div class="stat-label">Range</div> <div>{resolveWeapon(selectedWeaponId).range}</div>

                <div class="stat-label">Qualities</div>
                {#if resolveWeapon(selectedWeaponId).qualities.length > 0}
                <div>
                    {#each resolveWeapon(selectedWeaponId).qualities as quality, index}
                    <span>{resolveQuality(quality)?.name}</span>{#if index < resolveWeapon(selectedWeaponId).qualities.length - 1} <span>, </span> {/if}
                    {/each}
                </div>
                {:else}
                    <div>
                        -
                    </div>
                {/if}

                <div class="stat-label">Weight</div> <div>{resolveWeapon(selectedWeaponId).weight}</div>

                <div class="stat-label">Cost</div> <div>{resolveWeapon(selectedWeaponId).cost}</div>

                <div class="stat-label">Rarity</div> <div>{resolveWeapon(selectedWeaponId).rarity}</div>
            </div>
        </div>

        <div class="stats-final">
            <h4>Modded Stats</h4>
            <div class="statgrid">
                {#if moddedWeapon}
                    <div class="stat-label">Name</div> <div>{moddedWeapon.name}</div>

                    <div class="stat-label">Ammunition</div> <div>{moddedWeapon.ammo}</div>

                    <div class="stat-label">Type</div> <div>{moddedWeapon.type}</div>

                    <div class="stat-label">Damage Rating</div> <div>{moddedWeapon.damageRating} <CombatDie></CombatDie></div>

                    <div class="stat-label">Damage Effects</div>
                    {#if moddedWeapon.damageEffects.length > 0}
                        <div>
                            {#each moddedWeapon.damageEffects as effect, index}
                            <span>{resolveEffect(effect)?.name}</span>{#if index < moddedWeapon.damageEffects.length - 1} <span>, </span> {/if}
                            {/each}
                        </div>
                    {:else}
                        <div>
                            -
                        </div>
                    {/if}

                    <div class="stat-label">Damage Type</div> <div>{moddedWeapon.damageType}</div>

                    <div class="stat-label">Fire Rate</div> <div>{moddedWeapon.firerate}</div>

                    <div class="stat-label">Range</div> <div>{moddedWeapon.range}</div>

                    <div class="stat-label">Qualities</div>
                    {#if moddedWeapon.qualities.length > 0}
                        <div>
                            {#each moddedWeapon.qualities as quality, index}
                            <span>{resolveQuality(quality)?.name}</span>{#if index < moddedWeapon.qualities.length - 1} <span>, </span> {/if}
                            {/each}
                        </div>
                    {:else}
                        <div>
                            -
                        </div>
                    {/if}

                    <div class="stat-label">Weight</div> <div>{moddedWeapon.weight}</div>

                    <div class="stat-label">Cost</div> <div>{moddedWeapon.cost}</div>
                {:else}
                    <div class="stat-label">No modded stats available.</div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .selector {
        display: flex;
        flex-direction: row;
        gap: 32px;
    }

    .selector-column {
        font-size: var(--font-size-h4)
    }

    .selector-column label {
        font-size: var(--font-size-xl);
    }

    .stats {
        display: flex;
        gap: 64px;
    }

    .stat-label {
        text-align: right;
    }

    .statgrid {
        display: grid;
        grid-template-columns: auto auto;
        gap: 4px 16px;
    }
</style>