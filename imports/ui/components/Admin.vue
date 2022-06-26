<template>
  <div class="container">
    <h1>Database Info:</h1>
      <p>We have {{ pages.length }} entries in database.</p>
    <v-btn @click="adminMode = 'importBook'">Import book</v-btn>
    <v-row v-if="adminMode == 'importBook'">
      <v-col>
        <v-card width="600" height="300" raised>
          <v-card-title>Import book from file:</v-card-title>
          <br />
          <v-card-text>
            <v-file-input
              accept=".json"
              label="Click here to select a .json file"
              outlined
              v-model="sessionFile"
            >
            </v-file-input>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn right @click="importbook">Import Data</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/PageCollection";
import { Random } from "meteor/random";
export default {
  data() {
    return {
      adminMode: "importBook",
      sessionFile: null,
    };
  },
  watch: {
    sessionFile(newVal) {
      console.log(newVal);
    }
  },
  methods: {
    importbook() {
      if (!this.sessionFile) {
        alert("No File Chosen");
        return;
      }
      var reader = new FileReader();
      // Use the javabook reader object to load the contents
      // of the file in the v-model prop
      reader.readAsText(this.sessionFile);
      reader.onload = e => {
        this.makebook(e.target.result);
      };
    },
    makebook(dataString) {
      //alert("Making book");
      this.clearPages();
      const bookData = JSON.parse(dataString);
      console.log('Pages read:',bookData.length)
      let bookPages=[];
      bookData.forEach(element => {
        const pageId=Random.id([17]);
        element._id=pageId;
        PageCollection.insert(element);
        bookPages.push(pageId);
      });
      PageCollection.insert(this.makeBookObject(bookPages));
      let bo=PageCollection.find({type: 'book'}).fetch();
    },
    clearPages () {
      const myPages = PageCollection.find({}).fetch(); 
      myPages.forEach(e => PageCollection.remove({_id: e._id}));
    },
    makeBookObject(bookPages) {
      return {
        type: 'book',
        title: "An Elementary Introduction to the Hopf Fibration",
        authors: 'David W. Lyons',
        description: 'Interactive version by Ingo Dahn',
        pages: bookPages
      }
    }
  },
  meteor: {
    pages() {
      let pc = PageCollection.find({}).fetch();
      return pc;
    },
  }
};
</script>