<template>
  <div class="container">
    <v-row>
      <v-col>
        <h1>Editing Book: {{ bookObject.title }}</h1>
        <h2 v-if="pageObject">At page: {{ currentTitle }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-radio-group v-model="editMode" row>
        <v-radio label="Edit this" value="editThis"></v-radio>
        <v-radio label="New before" value="newBefore"></v-radio>
        <v-radio label="New after" value="newAfter"></v-radio>
      </v-radio-group>
      <v-col>
        <v-select
          :items="pageTypes"
          v-model="pageType"
          label="Select page type"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" @click="save">Save</v-btn>
      </v-col>
      <v-col>
        <v-btn color="warning" @click="cancel">Cancel</v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="warning"
          class="mx-1 my-1"
          :disabled="!pageObject"
          @click="deleteThis"
          >Delete</v-btn
        >
      </v-col>
    </v-row>
    <MetaData :data="metaDataString" @changedMetaData="saveMetaData"/>
    <v-row>
      <v-col>
        <v-text-field
          label="Title"
          hide-details="auto"
          v-model="current.title"
        ></v-text-field>
        <v-textarea
          outlined
          label="Content:"
          v-model="current.data"
        ></v-textarea>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import { Random } from "meteor/random";
import MetaData from '../components//MetaData.vue';

export default {
  data() {
    return {
      session: this.$root.$data.session,
      current: {
        title: "",
        data: "",
      },
      pageType: "markdown-cell",
      pageTypes: [
        { text: "HTML", value: "markdown-cell" },
        { text: "Code", value: "code-cell" },
        { text: "Markdown", value: "markdown" },
      ],
      editMode: null,
    };
  },
  components: { MetaData },
  mounted() {
    if (this.pageObject) {
      this.editMode = "editThis";
    } else this.editMode = "newAfter";
  },
  watch: {
    editMode(em) {
      switch (em) {
        case "editThis": {
          this.current.title = this.pageObject.title;
          this.pageType = this.pageObject.type;
          this.current.data =
            this.pageObject.type == "code-cell"
              ? this.pageObject.script
              : this.pageObject.data;
          break;
        }
        default: {
          this.current.title = "";
          this.pageType = "markdown-cell";
          this.current.data = "";
        }
      }
    },
  },
  methods: {
    cancel() {
      this.$router.back();
    },
    saveMetaData(md) {
      console.log('Edit-111: saveMetaData called');
      if (this.editMode == "editThis") {
        this.current.title=md.title;
        let cid=this.pageObject._id;
        Meteor.call('deleteItem',{name: 'LabelForId', target: cid});
        if (md.label) Meteor.call('insertItem', {type: 'relation',name: 'LabelForId', source: md.label, target: cid})
        if (md.requires) {
          Meteor.call('deleteItem',{name: 'requires', source: cid});
          md.requires.forEach(ll => Meteor.call('insertItem',{type: 'relation', name: 'requires', source: md.label, target: ll}));
        }
      }
    },
    save() {
      if (this.editMode == "editThis") this.saveThis();
      if (this.editMode == "newBefore") this.create(-1);
      if (this.editMode == "newAfter") this.create(1);
    },
    saveThis() {
      let d = { title: this.current.title, type: this.pageType };
      if (this.pageType == "code-cell") {
        d.script = this.current.data;
        d.data = "<span></span>";
      } else {
        d.data = this.current.data;
      }
      d._id = this.pageObject._id;
      Meteor.call("updateItem", d);
      alert("Page updated. Re-visit page to update");
      this.session.mode = "book";
    },
    
    deleteThis() {
      let books = PageCollection.find({ type: "book" }).fetch();
      let id = this.pageObject._id;
      books.forEach((b) => {
        let i = b.pages.indexOf(id);
        if (i > -1) {
          b.pages.splice(i, 1);
          Meteor.call("updateItem", b);
        }
      });
      Meteor.call("deleteItem", this.pageObject);
      alert(
        "Page deleted. User interface may be inconsistent - reset recommended."
      );
    },
    create(delta) {
      let d = { title: this.current.title, type: this.pageType };
      if (this.pageType == "code-cell") {
        d.script = this.current.data;
        d.data = "";
      }
      if (this.pageType == "markdown-cell") {
        d.data = this.current.data;
      }
      if (this.pageType == "markdown") {
        d.data = this.current.data;
      }
      let id = Random.id([17]);
      d._id = id;
      let pid = parseInt(this.session.currentPage);
      const pindex = pid ? pid : 0;
      zindex = Math.min(
        Math.max(0, pindex + delta - 1),
        this.bookObject.pages.length
      );
      this.bookObject.pages.splice(zindex, 0, id);
      Meteor.call("insertItem", d);
      Meteor.call("updateItem", this.bookObject);
      this.session.currentPage = zindex;
      this.session.mode = "book";
    },
  },
  computed: {
    pageObject() {
      if (this.bookObject.pages.length) {
        let pageId = this.bookObject.pages[this.session.currentPage - 1];
        if (pageId) {
          let po = PageCollection.findOne({ _id: pageId });
          if (po) return po;
          else {
            if (confirm("Page not found. Remove from book?")) {
              this.bookObject.pages.splice(this.session.currentPage - 1, 1);
              Meteor.call("updateItem", this.bookObject);
              alert("Database has changed - Reset recommended");
              this.session.mode = "book";
            }
          }
        }
      }
      return false;
    },
    currentTitle() {
      return this.pageObject.title;
    },
    metaDataString () {
      let po = this.pageObject;
      let md={title: po.title}, pid=po._id;
      let plabel=PageCollection.findOne({name: 'LabelForId', target: pid});
      md.label=(plabel)?plabel.source:'';
      let reqs=PageCollection.find({name: 'requires', source: pid}).fetch();
      md.requires=(reqs)?reqs:[];
      return JSON.stringify (md,null,2);
      
    }
  },
  meteor: {
    bookObject() {
      const bo = PageCollection.findOne({ _id: this.session.currentBook });
      return bo ? bo : { title: "Current Book not Found", pages: [] };
    },
  },
};
</script>

<style scoped>
v-select {
  max-width: 10;
}
</style>