<script lang="ts">
    import logo from '$lib/assets/vault-smile.svg';
</script>

<header class="header-container">
    <img class="logo" alt="Fallout2D20 Utils" src="{logo}">
    <div class="logo-label">
        Fallout 2d20 Utils
    </div>
    
</header>

<style>
    .header-container {
        height: var(--header-height);
        width: 100%;
        background-color: var(--surface);
        color: var(--on-surface);

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    }

    .logo {
        height: 60%;
        margin-left: 16px;
    }

    .logo-label {
        font-weight: bold;
        color: var(--secondary);
    }
</style>