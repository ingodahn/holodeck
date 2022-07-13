<template>
  <v-row>
    <v-col>
      <p v-if="books.length == 0">No books on list</p>
      <v-expansion-panels v-else focusable>
        <v-expansion-panel v-for="(item,index) in myBooks" :key="index">
          <v-expansion-panel-header>
            <span><img :src="isOpen(item._id)" width="20px" height="20px"/></span><span> {{ item.title }} by {{ item.authors }}</span>
            
             
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>{{ item.description }}</div>
            <v-card-actions>
              <v-btn color="success" @click="toggleButton(index)">
                {{ bookLabels[index] }}
              </v-btn>
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
      bookLabels: []
    };
  },
  props: { books: { type: Array, } },
  mounted() {
    this.updateBookLabels();
  },
  watch: {
    myBooks() {
      // this.updateBookLabels();
    }
  },
  methods: {
    toggleButton (i) {
      let bi=this.myBooks[i];
      /*
      if (bi.opened == "Open") {
        bi.opened = 'Close';
        this.openBook(bi._id)
      }
      else {
        bi.opened = 'Open';
        this.closeBook(bi._id);
      }
      */
     if (this.openAt(bi._id)) {
      //this.bookLabels[i] = 'Closed';
      this.closeBook(bi._id);
     }
     else {
      //this.bookLabels[i] = 'Open';
      this.openBook(bi._id);
     }
      this.updateBookLabels()
    },
    
    openAt(bookId) {
      return this.session.books.hasOwnProperty(bookId);
    },
    isOpen(id) {
      const base="https://api.mdisvg.com/v1/i/"
      const ic= (this.openAt(id))?'book-open-variant':'bookshelf';
      return base+ic;
    },
    openBook(id) {
      console.log("Booklist-48: Opening", id);
      this.session.books[id] = 1;
      this.session.set("currentBook", id, "BookList");
    },
    closeBook(id) {
      console.log("Booklist-48: Closing", id);
      delete this.session.books[id];
      if (this.session.currentBook == id) {
        let ok = Object.keys(this.session.books);
        if (!ok.length > 0) this.session.currentBook = null;
        else this.session.currentBook = ok[0];
      }
    },
    
    updateBookLabels () {
      let allIds=[]
      this.myBooks.forEach(b => {allIds.push(b._id)});
      let allLabels=[];
      allIds.forEach(ll => {allLabels.push((this.openAt(ll))?'Close':'Open')});
      console.log('Booklist-116:',allLabels);
      this.bookLabels = allLabels;
    }
    
  },
  computed: {
    
  },
  meteor: {
  },
};
</script>