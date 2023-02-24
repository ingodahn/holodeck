<template>
  <div class="container">
    <v-row>
      <v-col cols="mainColSize">
        <div :name="pageId">
          <sage-cell
            :currentPage="currentPage"
            :script="currentScript()"
            :class="isCurrent"
            :cellName="pageId"
            @evaluated="setEvaluated"
            :key="myKey"
            kernelKey="holodeck"
          ></sage-cell>
        </div>
      </v-col>
      <v-col cols="1" v-if="needsMissing || needsReset">
        <v-btn
          v-if="needsMissing"
          icon
          @click="addRequired()"
          title="Click to add prerequisites"
          ><v-icon>mdi-vector-polyline-edit</v-icon></v-btn
        >
        <v-btn v-if="needsReset" icon @click="reset()" title="Click to reset this cell"
          ><v-icon>mdi-undo-variant</v-icon></v-btn
        >
        <v-btn v-if="hidden" icon @click="showInput()" title="Click to reveal cell input"
          ><v-icon>mdi-eye-outline</v-icon></v-btn
        >
        <v-btn v-else icon @click="hideInput()" title="Click to hide cell input"
          ><v-icon>mdi-eye-off-outline</v-icon></v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import relationMixin from "../mixins/relationMixin.js";
import SageCell from "./SageCell.vue";

export default {
  components: { SageCell },

  props: {
    script: {
      type: String,
      default: "1+1",
    },
    scriptModified: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Boolean,
      default: false,
    },
    pageId: {
      type: String,
      default: "none",
    },
  },
  mixins: [relationMixin],
  data() {
    return {
      session: this.$root.$data.session,
      evaluated: this.$root.$data.session.evaluated.has(this.pageId),
      myKey: 1,
      myKernelKey: this.kernelKey,
      allRequired: false,
      refreshRequirements: false,
      hidden: false
    };
  },
  
  created() {
    let ff = this.checkStatus;
    this.$root.$on("evaluationUpdated", ff);
  },
  methods: {
    checkStatus() {
      this.evaluated = this.$root.$data.session.evaluated.has(this.pageId);
      this.refreshRequirements = !this.refreshRequirements; // to force update
    },
    setEvaluated(newScript) {
      this.$root.$data.session.evaluated.add(this.pageId); // record evaluation in session
      this.session.modifiedScripts[this.pageId] = newScript;
      this.evaluated = true;
      if (this.allRequired)
        this.missingRequired.forEach((id) => {
          this.$root.$data.session.evaluated.add(id);
        });
      this.$root.$emit("evaluationUpdated"); // tell other components
    },
    getRelationTrans(rel) {
      let labelObject = PageCollection.findOne({
        name: "LabelForId",
        target: this.pageId,
      });
      if (labelObject) {
        let labelInit = new Set();
        labelInit.add(labelObject.source);
        let reqs = Array.from(this.tcClosure(rel, labelInit, 1));
        reqs.shift();
        return reqs; // should be labels
      } else return [];
    },
    getRelationTransList(rel) {
      let labelObject = PageCollection.findOne({
        name: "LabelForId",
        target: this.pageId,
      });
      if (labelObject) {
        let pageIdLabel=labelObject.source;
        let labelInit=[pageIdLabel];
        let reqs = this.tcClosureList(rel, labelInit, 1);
        reqs.shift();
        return reqs; // should be labels
      } else return [];
    },
    addRequired() {
      let sc = "";
      let missReq = this.missingRequired;
      if (missReq.length > 0) {
        missReq.forEach((id) => {
          sc += this.getCurrentScript(id) + "\n"; // doesn't work for html
        });
        this.needsReset;
      }
      sc += this.script;
      this.allRequired = true;
      this.session.modifiedScripts[this.pageId] = sc;
      this.myKey = this.myKey + 1;
    },
    getCurrentScript(id) {
      return this.session.modifiedScripts[id]
        ? this.session.modifiedScripts[id]
        : PageCollection.findOne({ _id: id }).data;
    },
    currentScript() {
      return this.session.modifiedScripts[this.pageId]
        ? this.session.modifiedScripts[this.pageId]
        : this.script;
    },
    reset() {
      delete this.session.modifiedScripts[this.pageId];
      this.evaluated = false;
      this.allRequired = false;
      this.myKey = this.myKey + 1;
      //this.needsReset;
      this.$root.$emit("evaluationUpdated"); // tell other components
    },
    hideInput() {
      this.hidden=true;
      $('.sagecell_input').hide();
    },
    showInput() {
      this.hidden=false;
      $('.sagecell_input').show();
    },
    // Convert the list of labels of required pages to a list of page ids sorted by book
    sortByBooks(pageList) {
      let currentBookLabel=this.ids2labels([this.session.currentBook])[0];
      let bookList = this.getPrerequisiteLabelsSorted(this.ids2labels([this.session.currentBook])[0]);
      let bookPageIdsSorted=[];
      for (let i = 0; i < bookList.length; i++) {
        let book = bookList[i];
        // get all prequired ages of this book
        let bookPageLabels = pageList.filter((p) => this.bookLabel(p) === book);
        bookPageLabels.forEach((p) => {
          let index = pageList.indexOf(p);
          pageList.splice(index, 1);
        });
        bookPageIdsSorted = bookPageIdsSorted.concat(this.sortBookLabelIds(bookPageLabels,book));
      }
      return bookPageIdsSorted;
    },
    prerequisites(bookId) {
      let book = PageCollection.findOne({ _id: bookId });
      return book.requires ? book.requires : [];
    },
    addPrerequisiteLabels(labelList, labelObject) {
      labelList.forEach((label) => {
        if (!labelObject[label]) {
          let bookId = PageCollection.findOne({
            name: "LabelForId",
            source: label,
          }).target;
          let reqs = this.prerequisites(bookId);
          labelObject[label] = reqs;
          this.addPrerequisiteLabels(reqs, labelObject);
        }
      });
    },
    sortLabelObject(labelObject) {
      let sorted = [], ready= false;
      while (!ready) {
        ready = true;
        for (let label in labelObject) {
          let newLabels = labelObject[label].filter((l) => !sorted.includes(l));
          if (newLabels.length == 0) {
            sorted.push(label);
            delete labelObject[label];
            ready = false;
          }
        }
      }
      return sorted;
    },
    getPrerequisiteLabelsSorted(label) {
      try {
        let labelObject = {};
        let reqs = this.prerequisites(PageCollection.findOne({name: "LabelForId", source: label}).target);
        labelObject[label]= reqs;
        this.addPrerequisiteLabels(reqs, labelObject);
        return this.sortLabelObject(labelObject);
      } catch (e) {
        alert("Error in getPrerequisiteLabelsSorted for " + label+ ":"+ e)
        return [];
      }
      /*
      let id=PageCollection.findOne({name: "LabelForId", source: label}).target;
      let reqs = this.prerequisites(id);
      let labelObject = {};
      labelObject[label]= reqs;
      this.addPrerequisiteLabels(reqs, labelObject);
      return this.sortLabelObject(labelObject);
      */
    },
  },
  computed: {
    missingRequired() {
      this.refreshRequirements; // to force re-computation
      // TODO: Books hinzufügen
      let reqs = this.sortByBooks(this.getRelationTransList("requires"));
      let mreqs = [];
      reqs.forEach((r) => {
        if (!this.$root.$data.session.evaluated.has(r)) mreqs.push(r);
      });
      return mreqs; // returns Ids
    },
    hasMissing() {
      return this.missingRequired.length;
    },
    needsMissing() {
      return this.hasMissing && !this.allRequired;
    },
    needsReset() {
      return this.session.modifiedScripts.hasOwnProperty(this.pageId);
    },
    mainColSize() {
      return hasMissing ? 11 : 12;
    },
    isCurrent() {
      this.refreshRequirements; // to force re-computation
      let ev = this.evaluated ? "evaluated" : "unevaluated";
      if (this.missingRequired.length && !this.allRequired && !this.evaluated)
        ev = "unavailable";
      const cur = this.currentPage ? "currentPage" : "";
      return cur + " " + ev;
    },
  },
};
</script>

<style scoped>
.unavailable {
  padding: 1em;
  border-style: none solid none none;
  border-right-color: red;
}
.unevaluated {
  padding: 1em;
  border-style: none solid none none;
  border-right-color: orange;
}
.evaluated {
  padding: 1em;
  border-style: none solid none none;
  border-right-color: green;
}
.currentPage.unavailable {
  padding: 1em;
  border-style: none solid none solid;
  border-left-color: red;
  border-right-color: red;
}
.currentPage.evaluated {
  padding: 1em;
  border-style: none solid none solid;
  border-left-color: green;
  border-right-color: green;
}
.currentPage.unevaluated {
  padding: 1em;
  border-style: none solid none solid;
  border-left-color: orange;
  border-right-color: orange;
}
</style>