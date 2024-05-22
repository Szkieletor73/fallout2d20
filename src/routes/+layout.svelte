<script lang="ts">
    import '$lib/styles.css'
    import '$lib/themes/dark.css'

    import Header from '$lib/header.svelte';
	import Footer from '$lib/footer.svelte';
</script>

<main>
    <Header></Header>
    
    <article>
        <slot></slot>
    </article>
    
    <Footer></Footer>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        align-items: center;
    }

    main article {
        flex-grow: 1;
        flex-shrink: 0;
        width: 100%;

        max-width: 1400px;
        padding: 16px 32px;
    }
    
</style>