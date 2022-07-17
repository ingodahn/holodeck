<template>
    <v-menu open-on-hover offset-y :disabled="menuItems.length == 0">
        <!-- preserved as template for later use -->-->
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" class="mx-1 my-1" v-bind="attrs" v-on="on"> {{ menuTitle }} </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in menuItems" :key="index" @click="menuSelect(item)">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
</template>

<script>
export default {
    data () {
        return {
            //menuItems: ["Add before", "Add after", "Update", "Delete"],
        }
    },
    props: {menuTitle: {type: String},menuItems: {type: Array}},
    methods: {
        menuSelect(val) {
            this.$emit('menuSelected',val);
        }
    }
}
</script>