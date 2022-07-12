<template>
  <v-row>
    <!--
    <v-col>
      {{myBooks.length}}
      <ul>
        <li v-for="(item,index) in myBooks" v-bind:key="index">
        {{ item.title }}
          <button color="primary" @click="toggleButton(index)"> {{ myBooks[index].opened }} </button>
        </li>
      </ul>
      
    </v-col>
    -->
    <v-col>
      <!--
      <ul>
        <li v-for="(item,index) in myBooks" v-bind:key="index">
          {{ item.title }} by {{ item.authors }} 
          <v-btn color="success" @click="toggleButton(index)">
               {{ myBooks[index].opened }}
              </v-btn>
        </li>
      </ul>
      -->
      
      <v-expansion-panels focusable>
        <v-expansion-panel v-for="(item,index) in myBooks" :key="index">
          <v-expansion-panel-header>
            <span><img :src="isOpen(item._id)" width="20px" height="20px"/></span><span> {{ item.title }} by {{ item.authors }}</span>
            
             
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>{{ item.description }}</div>
            <v-card-actions>
              <v-btn color="success" @click="toggleButton(index)">
                {{ myBooks[index].opened }}
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
    };
  },
  props: { books: { type: Array, } },
  mounted() {
  },
  methods: {
    toggleButton (i) {
      let bi=this.myBooks[i];
      if (bi.opened == "Open") {
        bi.opened = 'Close';
        this.openBook(bi._id)
      }
      else {
        bi.opened = 'Open';
        this.closeBook(bi._id);
      }
    },
    
    openAt(bookId) {
      return this.session.books.hasOwnProperty(bookId);
    },
    isOpen(id) {
      const base="https://api.mdisvg.com/v1/i/"
      const ic= (this.openAt(id))?'book-open-variant':'bookshelf';
      return base+ic;
    },
    bookAction(id) {
      console.log("Booklist-42:", id, this.openAt(id));
      if (this.openAt(id)) this.closeBook(id);
      else this.openBook(id);
      console.log('Booklist-47:',this.opened)
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
    bookColor(i) {
      if (!this.myBook) return "#FFFFFF";
      return (this.myBook[i].opened=='Close')?"#C6F68D":"#FFFFFF";
    }
  },
  computed: {
  },
  meteor: {
  },
};
</script>