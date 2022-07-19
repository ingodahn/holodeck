<template>
  <v-main>
    <v-row>
      <h2>Open selectedBooks</h2>
    </v-row>

    <v-row>
      <v-col md="auto">
        <BookList :books="selectedBooks"></BookList>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import BookList from "../components/BookList.vue";
export default {
  data() {
    return {
      session: this.$root.$data.session,
    };
  },
  components: { BookList },
  computed: {
    selectedBooks() {
      let selIds = Object.keys(this.session.books);
      return PageCollection.find({ _id: { $in: selIds } }).fetch();
    },
  },
};
</script>