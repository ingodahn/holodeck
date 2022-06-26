<template>
  <v-app>
    <v-app-bar app>
      <v-btn color="primary" class="mx-1 my-1" @click="mode = 'book'">Book</v-btn>
      <v-btn color="warning" class="mx-1 my-1" @click="mode = 'admin'">Tools</v-btn>
    </v-app-bar>
    <v-main>
      <Book v-if="mode == 'book'"></Book>
      <Admin v-if="mode == 'admin'"></Admin>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
import Book from "./components/Book.vue";
import { PageCollection } from "../api/PageCollection";
import Admin from "./components/Admin.vue";
export default {
  components: {
    //Page,
    Book,
    Admin,
  },
  data() {
    return {
      mode: "book",
    };
  },
  methods: {},
  meteor: {
  },
};
</script>

<style>
body {
  font-family: sans-serif;
  padding: 10px;
}
</style>
