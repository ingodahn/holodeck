<template>
  <div class="container">
    <v-row>
      <v-col>
        <h1>MathTrek HoloDeck</h1>
        <h2>Where do you go from here?</h2>
      </v-col>
    </v-row>
    <BookList :books="makeList()" />
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import BookList from "./BookList.vue";

export default {
  data() {
    return {
      session: this.$root.$data.session,
    };
  },
  components: { BookList },
  methods: {
    openBook(id) {
      this.session.set("bookId", id, "Home");
      this.session.set("currentPage", 1, "Home");
      this.session.set("mode", "book", "Home");
    },
    makeList () {
      //return [{title: "Title 1", opened: "Close"}, {title: "Title 2", opened: "Close"}]
      return this.booksOpening();
    },
    booksOpening() {
      let bb = this.books;
      let bo = [];
      bb.forEach((b) => {
        let bx = {
          _id: b._id,
          title: b.title,
          authors: b.authors,
          description: b.description
        };
        bx.opened = (this.session.books.hasOwnProperty(b._id)) ? "Close" : "Open";
        bo.push(bx);
      });
      console.log('Home-44:',bo)
      return bo;
    },
  },
  computed: {
    
  },
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