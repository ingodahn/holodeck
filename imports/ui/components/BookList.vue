<template>
  <v-row>
    <v-col>
      <p v-if="books.length == 0">No books on list</p>
      <v-expansion-panels v-else focusable>
        <v-expansion-panel v-for="(item, index) in myBooks" :key="index">
          <v-expansion-panel-header>
            <span>
              <v-icon>{{ isOpen(item._id) }}</v-icon> {{ item.title }} by
              {{ item.authors }}</span
            >
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>{{ item.description }}</div>
            <v-card-actions>
              <!--
              <v-btn icon v-if="openAt(item._id)" title="Close book" @click="closeBook(item._id)">
                <v-icon>mdi-bookshelf</v-icon>
              </v-btn>
              <v-btn icon v-else title="Open book" @click="openBook(item._id)"><v-icon>mdi-book-open-variant</v-icon></v-btn>
              -->
              <v-btn icon @click="toggleButton(index)" :title="iconTitle(item._id)">
                <v-icon>{{ bookLabels[index] }}</v-icon>
              </v-btn>
              
              <v-btn icon @click="readBook(item._id)" title="Read book"><v-icon>mdi-braille</v-icon> </v-btn>
              <router-link :to="routeLink(item)+'?deck=secondary'" target="_blank" title="Open on new deck"><v-icon>
                mdi-new-box
              </v-icon></router-link>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      session: this.$root.$data.session,
      myBooks: this.books,
      bookLabels: [],
    };
  },
  props: { books: { type: Array } },
  mounted() {
    this.updateBookLabels();
  },
  watch: {
    myBooks() {
      // this.updateBookLabels();
    },
  },
  methods: {
    toggleButton(i) {
      let bi = this.myBooks[i];
      if (this.openAt(bi._id)) {
        //this.bookLabels[i] = 'Closed';
        this.closeBook(bi._id);
      } else {
        //this.bookLabels[i] = 'Open';
        this.openBook(bi._id);
      }
      this.updateBookLabels();
    },

    openAt(bookId) {
      return this.session.books.hasOwnProperty(bookId);
    },
    isOpen(id) {
      return this.openAt(id) ? "mdi-book-open-variant" : "mdi-bookshelf";
    },
    openBook(id) {
      console.log('Booklist-72: Opening',id)
      this.session.books[id] = 1;
      //this.session.set("currentBook", id, "BookList");
    },
    closeBook(id) {
      delete this.session.books[id];
      if (this.session.currentBook == id) {
        let ok = Object.keys(this.session.books);
        if (!ok.length > 0) this.session.currentBook = null;
        else this.session.currentBook = ok[0];
      }
    },
    readBook(bookId) {
      if (!this.openAt(bookId)) this.openBook(bookId);
      this.$router.push("/read/" + bookId+'/1');
    },
    updateBookLabels() {
      let allIds = [];
      this.myBooks.forEach((b) => {
        allIds.push(b._id);
      });
      let allLabels = [];
      allIds.forEach((ll) => {
        allLabels.push(this.openAt(ll) ? "mdi-bookshelf" : "mdi-book-open-variant");
      });
      this.bookLabels = allLabels;
    },
    iconTitle(id) {
      return this.openAt(id) ? "Close book":"Open book";
    },
    routeLink(item) {
      return '/read/'+item._id+'/1';
    }
  },
  computed: {},
  meteor: {},
};
</script>