<script lang="ts">
	import type { SelectOption } from "$lib/interfaces";
	import Dropdown from "$lib/ui/dropdown.svelte";
	import type { PageData } from "./$types";
	import GunOutline from "./gun-outline.svelte";
	import { WeaponModSlot, type Weapon } from "./interfaces";
    import CombatDie from '$lib/ui/combat-die.svelte'

    export let data: PageData

    let selectedWeaponId: string
    let selectedWeapon: Weapon = data.itemData.weapons.find(x => x.id === selectedWeaponId) || data.itemData.weapons[0]

    let selectedModIds = {
        Receiver: undefined,
        Barrel: undefined,
        Magazine: undefined,
        Grip: undefined,
        Sights: undefined,
        Stock: undefined,
        Muzzle: undefined
    }
    let modOptions = {
        Receiver: filterMods(WeaponModSlot.Receiver),
        Barrel: filterMods(WeaponModSlot.Barrel),
        Magazine: filterMods(WeaponModSlot.Magazine),
        Grip: filterMods(WeaponModSlot.Grip),
        Sights: filterMods(WeaponModSlot.Sights),
        Stock: filterMods(WeaponModSlot.Stock),
        Muzzle: filterMods(WeaponModSlot.Muzzle)
    }

    $: updateSelection(selectedWeaponId)

    function updateSelection(id: string) {
        console.log("called!")
        selectedWeapon = data.itemData.weapons.find(x => x.id === id) || data.itemData.weapons[0]
        modOptions = {
            Receiver: filterMods(WeaponModSlot.Receiver),
            Barrel: filterMods(WeaponModSlot.Barrel),
            Magazine: filterMods(WeaponModSlot.Magazine),
            Grip: filterMods(WeaponModSlot.Grip),
            Sights: filterMods(WeaponModSlot.Sights),
            Stock: filterMods(WeaponModSlot.Stock),
            Muzzle: filterMods(WeaponModSlot.Muzzle)
        }
    }

    function filterMods(slot: WeaponModSlot): Array<SelectOption> {
        const output: Array<SelectOption> = [
            {
                label: "Default",
                value: undefined
            }
        ]

        if (selectedWeapon) {
            data.itemData.mods.forEach(mod => {
                const modOption = data.modOptions.find(x => x.value === mod.id)
                if (
                    mod.type === selectedWeapon.type
                    && mod.slot === slot
                    && selectedWeapon.compatibleMods[slot]?.includes(mod.id)
                    && modOption
                ) {
                    output.push(modOption)
                }
            })
        }
        console.log(selectedWeapon, output, data.modOptions)
        return output
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
            <Dropdown name="receiver" bind:selected="{selectedModIds.Receiver}" options={modOptions.Receiver}></Dropdown>
            <div class="statgrid">
                <!-- {#if selected} -->
                    <div class="stat-label"></div>
                <!-- {/if} -->
            </div>
        </div>

        <div class="selector-column">
            <label for="barrel">Barrel</label>
            <Dropdown name="barrel" options="{modOptions.Barrel}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="grip">Grip</label>
            <Dropdown name="grip" options="{modOptions.Grip}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="magazine">Magazine</label>
            <Dropdown name="magazine" options="{modOptions.Magazine}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="sights">Sights</label>
            <Dropdown name="sights" options="{modOptions.Sights}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="stock">Stock</label>
            <Dropdown name="stock" options="{modOptions.Stock}"></Dropdown>
        </div>

        <div class="selector-column">
            <label for="muzzle">Muzzle</label>
            <Dropdown name="muzzle" options="{modOptions.Muzzle}"></Dropdown>
        </div>
    </div>

    <div class="stats">
        <div class="stats-base">
            <h4>Weapon Base Stats</h4>
            <div class="statgrid">
                <div class="stat-label">Name</div> <div>{selectedWeapon?.name || "No weapon selected."}</div>
                {#if selectedWeapon}
                    <div class="stat-label">Ammunition</div> <div>{selectedWeapon.ammo}</div>

                    <div class="stat-label">Type</div> <div>{selectedWeapon.type}</div>

                    <div class="stat-label">Damage Rating</div> <div>{selectedWeapon.damageRating} <CombatDie></CombatDie></div>

                    <div class="stat-label">Damage Effects</div>
                    <div>
                        {#each selectedWeapon.damageEffects as effect, index}
                        <span>{effect.name}</span>
                        {#if index < selectedWeapon.damageEffects.length - 1}
                            <span>, </span>
                        {/if}
                        {/each}
                    </div>

                    <div class="stat-label">Damage Type</div> <div>{selectedWeapon.damageType}</div>

                    <div class="stat-label">Fire Rate</div> <div>{selectedWeapon.firerate}</div>

                    <div class="stat-label">Range</div> <div>{selectedWeapon.range}</div>

                    <div class="stat-label">Qualities</div>
                    <div class="stat-label">
                        {#each selectedWeapon.qualities as quality, index}
                        <span>{quality.name}</span>{#if index < selectedWeapon.qualities.length - 1} <span>, </span> {/if}
                        {/each}
                    </div>

                    <div class="stat-label">Weight</div> <div>{selectedWeapon.weight}</div>

                    <div class="stat-label">Cost</div> <div>{selectedWeapon.cost}</div>

                    <div class="stat-label">Rarity</div> <div>{selectedWeapon.rarity}</div>

                {/if}
            </div>
        </div>

        <div class="stats-final">
            <h4>Modded Stats</h4>
            <div class="statgrid">
                <div class="stat-label">Name</div> <div>{selectedWeapon?.name || "No weapon selected."}</div>
                {#if selectedWeapon}
                    <div class="stat-label">Ammunition</div> <div>{selectedWeapon.ammo}</div>

                    <div class="stat-label">Type</div> <div>{selectedWeapon.type}</div>

                    <div class="stat-label">Damage Rating</div> <div>{selectedWeapon.damageRating} <CombatDie></CombatDie></div>

                    <div class="stat-label">Damage Effects</div>
                    <div>
                        {#each selectedWeapon.damageEffects as effect, index}
                        <span>{effect.name}</span>
                        {#if index < selectedWeapon.damageEffects.length - 1}
                            <span>, </span>
                        {/if}
                        {/each}
                    </div>

                    <div class="stat-label">Damage Type</div> <div>{selectedWeapon.damageType}</div>

                    <div class="stat-label">Fire Rate</div> <div>{selectedWeapon.firerate}</div>

                    <div class="stat-label">Range</div> <div>{selectedWeapon.range}</div>

                    <div class="stat-label">Qualities</div>
                    <div>
                        {#each selectedWeapon.qualities as quality, index}
                        <span>{quality.name}</span>{#if index < selectedWeapon.qualities.length - 1} <span>, </span> {/if}
                        {/each}
                    </div>

                    <div class="stat-label">Weight</div> <div>{selectedWeapon.weight}</div>

                    <div class="stat-label">Cost</div> <div>{selectedWeapon.cost}</div>

                    <div class="stat-label">Rarity</div> <div>{selectedWeapon.rarity}</div>

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