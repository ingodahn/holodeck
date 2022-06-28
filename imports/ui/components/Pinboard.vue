<template>
    <div class="container">
        <v-row v-if="items.length == 0">
            <v-col>
                <div name='pinboard'>Pinboard is empty</div>
            </v-col>
        </v-row>
        <v-expansion-panels focusable multiple>
        <v-expansion-panel v-for="(item,i) in items" :key="i">
            <v-expansion-panel-header>
                {{ item.title }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <div v-html="item.content"></div>
            </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
export default {
    data () {
        return {items: []}
    },
    methods: {
        add(title,content) {
            this.items.push({title: title, content: content});
        }
    }
}
</script>