<template>
  <div class="container">
    <v-main>
      <h1>Database Info: {{ books.length }} Books on Deck</h1>
      <v-btn color="error" class="mx-1 my-1" @click="clearData"
        >Clear Data</v-btn
      >
      <v-btn color="warning" class="mx-1 my-1" @click="adminMode = 'deleteBook'"
        >Remove Book</v-btn
      >
      <v-btn color="success" class="mx-1 my-1" @click="adminMode = 'importBook'"
        >Import book</v-btn
      >
      <v-row v-if="adminMode == 'deleteBook'">
        <v-col>
          <v-select
            label="Select book to DELETE:"
            :items="books"
            item-text="title"
            item-value="_id"
            v-model="bookToDelete"
          ></v-select>
          <v-btn color="warning" @click="deleteBook">DELETE</v-btn>
        </v-col>
      </v-row>
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
      <v-row>
        <v-col>
          <v-btn color="primary" class="mx-1 my-1" @click="adminMode = 'users'"
            >User Management</v-btn
          >
        </v-col>
      </v-row>
      <v-row v-if="adminMode == 'users'">
        <UserManagement></UserManagement>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import { Random } from "meteor/random";
import UserManagement from "../components/UserManagement.vue";
export default {
  data() {
    return {
      adminMode: "importBook",
      sessionFile: null,
      bookToDelete: null,
    };
  },
  components: { UserManagement },
  watch: {},
  methods: {
    clearData() {
      if (
        confirm(
          "Are you SURE you REALLY want to delete all data on " +
            window.location.href +
            "?"
        )
      ) {
        this.clearPages({});
      }
    },

    deleteBook() {
      if (!this.bookToDelete) return;
      const bookObject = PageCollection.findOne({
        _id: this.bookToDelete,
        type: "book",
      });
      bookObject.pages.forEach((pid) => {
        Meteor.call("deleteItem", { _id: pid });
      });
      Meteor.call("deleteItem", { _id: bookObject._id });
    },
    importbook() {
      if (!this.sessionFile) {
        alert("No File Chosen");
        return;
      }
      var reader = new FileReader();
      reader.readAsText(this.sessionFile);
      reader.onload = (e) => {
        this.makebook(e.target.result);
      };
    },
    makebook(dataString) {
      //alert("Making book");
      const bookData = JSON.parse(dataString);
      let bookPages = [];
      bookData.data.forEach((element) => {
        const pageId = Random.id([17]);
        element._id = pageId;
        Meteor.call("insertItem", element);
        bookPages.push(pageId);
      });
      Meteor.call("insertItem", this.makeBookObject(bookData, bookPages));
    },
    clearPages(selection) {
      Meteor.call("deleteItem", selection);
      /*
      const myPages = PageCollection.find(selection).fetch(); 
      myPages.forEach(e => Meteor.call('deleteItem',{_id: e._id}));
      */
      alert("Clear of selected data completed");
      if (!PageCollection.find({ title: "|| Free Pages" }))
        Meteor.call("insertItem", {
          type: "book",
          title: "|| Free Pages",
          authors: "Various Authors",
          description: "Pages not assigned to any book",
          pages: [],
        });
    },
    makeBookObject(bookData, bookPages) {
      return {
        type: "book",
        title: bookData.title,
        authors: bookData.authors,
        description: bookData.description,
        pages: bookPages,
      };
    },
  },
  meteor: {
    pages() {
      let pc = PageCollection.find({}).fetch();
      return pc;
    },
    books() {
      return PageCollection.find(
        { type: "book" },
        { sort: { title: 1 } }
      ).fetch();
    },
  },
};
</script>