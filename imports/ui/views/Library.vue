<template>
  <div class="container">
    <v-main>
      <v-row>
        <v-col>
          <h1>MathTrek HoloDeck</h1>
          <h2>Where do you go from here?</h2>
        </v-col>
      </v-row>
      <BookList :books="books"></BookList>
    </v-main>
  </div>
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
  methods: {},
  computed: {},
  meteor: {
    books() {
      return PageCollection.find(
        { type: "book" },
        { sort: { title: 1 } }
      ).fetch();
    },
  },
};
</script>