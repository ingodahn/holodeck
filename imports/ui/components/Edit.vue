<template>
  <div class="container">
    <v-row>
      <v-col>
        <h1>Editing Book: {{ bookObject.title }}</h1>
        <h2 v-if="pageObject">At page: {{ currentTitle }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-btn color="primary" class="mx-1 my-1" :disabled="!currentTitle"
        >Edit this</v-btn
      >
      <v-btn color="success" class="mx-1 my-1">Add before</v-btn>
      <v-btn color="success" class="mx-1 my-1">Add after</v-btn>
      <v-btn color="warning" class="mx-1 my-1" :disabled="!pageObject"
        >Delete</v-btn
      >
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";

export default {
  data() {
    return {
      session: this.$root.$data.session,
    };
  },
  computed: {
    pageObject() {
      if (this.bookObject.pages.length) {
        let pageId = this.bookObject.pages[this.session.currentPage - 1];
        if (pageId) {
          return PageCollection.findOne({ _id: pageId });
        }
      }
      return false;
    },
  },
  meteor: {
    bookObject() {
      const bo = PageCollection.findOne({ _id: this.session.bookId });
      return bo ? bo : { title: "No Book Found", pages: [] };
    },
  },
};
</script>