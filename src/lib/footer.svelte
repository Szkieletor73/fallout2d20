<script lang="ts">
    let year = new Date().getFullYear()
</script>

<footer class="footer-container">
    <div class="footer-content">
        <div class="footer-thumb">

        </div>

        <div class="footer-copy">
            <a href="https://github.com/Szkieletor73">© {year} Szkieletor</a>
        </div>

        <div class="footer-meta">

        </div>

        <div class="footer-attribution">
            Fallout and it's trademarks belong to Bethesda Softworks LLC.<br>
            Fallout: The Roleplaying Game © Modiphius Entertainment.
        </div>
    </div>
</footer>

<style>
    .footer-container {
        height: var(--footer-height);
        width: 100%;
        padding: 0px 48px;
    }

    .footer-content {
        max-width: 1200px;
        margin: 32px auto;

        display: grid;
        grid-template-columns: 1fr 1fr; 
        grid-template-rows: auto fit-content; 
        grid-template-areas: 
            "thumb meta"
            "copy attribution"; 
    }

    .footer-thumb {
        grid-area: thumb;
    }

    .footer-copy {
        grid-area: copy;
        display: flex;
        align-items: end;
    }

    .footer-meta {
        grid-area: meta;
    }

    .footer-attribution {
        grid-area: attribution;
        opacity: 0.7;
    }
</style>