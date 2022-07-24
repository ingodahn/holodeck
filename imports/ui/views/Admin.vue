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
      <v-btn
        color="success"
        class="mx-1 my-1"
        @click="adminMode = 'importJupyter'"
        >Import Jupyter Notebook</v-btn
      >
      <v-btn
        color="success"
        class="mx-1 my-1"
        @click="adminMode = 'importPlayer'"
        >Import book from NotebookPlayer</v-btn
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
      <v-row v-if="adminMode == 'importJupyter' || adminMode == 'importPlayer'">
        <v-col>
          <v-card width="600" height="300" raised>
            <v-card-title>Import book from file:</v-card-title>
            <br />
            <v-card-text>
              <v-file-input
                :accept="importFile.type"
                :label="importFile.label"
                outlined
                v-model="sessionFile"
              >
              </v-file-input>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn right @click="importBook">Import</v-btn>
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
      adminMode: "importPlayer",
      sessionFile: null,
      bookToDelete: null,
    };
  },
  components: { UserManagement },
  watch: {},
  computed: {
    importFile() {
      console.log('Admin-88:',this.adminMode)
      return this.adminMode == "importJupyter"
        ? {
            type: ".ipynb",
            label: "Click here to select a Jupyter notebook file",
          }
        : { type: ".json", label: "Click here to select a JSON file" };
    },
  },
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
    importBook() {
      if (!this.sessionFile) {
        alert("No File Chosen");
        return;
      }
      var reader = new FileReader();
      reader.readAsText(this.sessionFile);
      reader.onload = (e) => {
        this.makeBook(e.target.result);
      };
    },
    makeBook(data) {
      const bookData = JSON.parse(data);
      if (this.adminMode == "importJupyter") this.makeJupyterBook(bookData);
      else this.makePlayerBook(bookData);
    },
    // Making Jupyter Book
    makeJupyterBook(bookData) {
      console.log('Admin-138: makeJupiterBook called')
      let bookPages = [];
      if (!bookData.cells.length) {
        alert("N0 pages found, aborting");
        return;
      }
      let firstCell = bookData.cells[0];
      let bookMetaData = {
        title: firstCell.metadata.book.title
          ? firstCell.metadata.book.title
          : "No title given",
        authors: firstCell.metadata.book.authors
          ? firstCell.metadata.book.authors
          : "No authors given",
        description: firstCell.metadata.book.description
          ? firstCell.metadata.book.description
          : "No description given",
        label: firstCell.metadata.book.label
          ? firstCell.metadata.book.label
          : "label" + Random.id([17]),
      };
      bookData.cells.forEach((c) => {
        let cc = {
          type: c.cell_type,
          data: c.source.join(),
        };
        if (c.metadata.label) cc.label = c.metadata.label;
        cc.title = (c.metadata.title)?c.metadata.title: this.makeTitle(c.source,c.cell_type);
        const pageId = Random.id([17]);
        cc._id = pageId;
        Meteor.call("insertItem", cc);
        bookPages.push(pageId);
        if (cc.label)
          Meteor.call("insertItem", {
            type: "relation",
            name: 'LabelForId',
            source: cc.label,
            target: pageId,
          });
      });
      Meteor.call(
        "insertItem",
        this.makePlayerBookObject(bookMetaData, bookPages)
      );
      alert('Book '+bookMetaData.title+' with '+bookPages.length.toString()+' pages saved');
    },

    makeTitle (data,type) {
      return (type == 'code')?data[0]:data.join().replace(/(\s\s+)/gm, "").split(' ').slice(0,4).join(' ');
    },

    // For tests only
    Mcall(type,object) {
      console.log('Admin-189:',type,object);
    },

    // Making Player Book
    makePlayerBook(bookData) {
      //alert("Making book");

      let bookPages = [];
      bookData.data.forEach((element) => {
        const pageId = Random.id([17]);
        element._id = pageId;
        Meteor.call("insertItem", element);
        bookPages.push(pageId);
      });
      Meteor.call("insertItem", this.makePlayerBookObject(bookData, bookPages));
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
    makePlayerBookObject(bookData, bookPages) {
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