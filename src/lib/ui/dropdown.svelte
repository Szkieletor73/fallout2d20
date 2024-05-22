<script lang="ts">
	import type { SelectOption } from "$lib/interfaces";

    export let options: Array<SelectOption>
    export let selected: string | undefined = undefined
    export let name: string = "unnamed-select"
</script>

<div>
    <select name="{name}" bind:value={selected}>
        {#each options as option}
            <option
                value={option.value}
                disabled={option.disabled}
                selected={selected === option.value}
                class:group-label={option.groupLabel}>
                {option.label}
            </option>
        {/each}
    </select>
</div>

<style>

</style>