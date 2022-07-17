<template>
    <div class="container">
    <MtNavigation/>
    <v-main>
        <h1>The MathTrek Holodeck</h1>
        <p>Start by opening a book from the library which you can find under the <em>Home</em> menu.</p>
    </v-main>
    </div>
</template>

<script>
import MtNavigation from '../components/MtNavigation.vue';
export default {
    components: { MtNavigation }
}
</script>