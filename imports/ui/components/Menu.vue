<template>
    <v-menu open-on-hover offset-y>
        <!-- preserved as template for later use -->-->
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" class="mx-1 my-1" v-bind="attrs" v-on="on"> Edit </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in editMenuItems" :key="index" @click="menuSelect(item)">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
</template>

<script>
export default {
    data () {
        return {
            editMenuItems: ["Add before", "Add after", "Update", "Delete"],
        }
    },
    methods: {
        menuSelect(val) {
            alert('Selected '+val);
        }
    }
}
</script>