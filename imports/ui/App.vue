<template>
  <v-app>
    <v-app-bar app>
      <v-btn
        color="primary"
        class="mx-1 my-1"
        @click="session.set('mode', 'book', 'App')"
        >Book</v-btn
      >
      <v-btn
        color="warning"
        class="mx-1 my-1"
        @click="session.set('mode', 'admin', 'App')"
        >Tools</v-btn
      >
    </v-app-bar>
    <v-main>
      <Book v-if="session.mode == 'book'"></Book>
      <Admin v-if="session.mode == 'admin'"></Admin>
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
      session: {
        mode: "book",
        bookId: "none",
        currentPage: 1,
        pre: -1,
        post: 0,
        evaluated: new Set(),
        debug: false,
        set(item, newValue, by = "anonymous") {
          if (this.debug)
            console.log("Session setting", item, "to", newValue, "by", by);
          this[item] = newValue;
        },
        clear () {
          this.mode = "book";
          this.bookId = "none";
          this.currentPage = 1;
          this.pre = -1;
          this.post = 0,
          this.evaluated = new Set();
        }

      }
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
