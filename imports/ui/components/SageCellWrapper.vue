<template>
  <div class="container">
    <v-row>
      <v-col cols="mainColSize">
        <div :class="isCurrent" :name="pageId">
          <sage-cell :script="myScript" :cellName="pageId" @evaluated="setEvaluated" :key="myScript"></sage-cell>
        </div>
      </v-col>
      <v-col cols="1" v-if="hasMissing">
        <p>Click to add prerequisites: 
          <v-btn icon @click="addRequired()"><v-icon>mdi-vector-polyline-edit</v-icon></v-btn>
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import relationMixin  from "../mixins/relationMixin.js";
import SageCell from './SageCell.vue';

export default {
  components: { SageCell },
  props: {
    script: {
      type: String,
      default: "1+1",
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
      myScript: this.script,
      allRequired: false
    };
  },
  
  methods: {
    setEvaluated () {
        this.$root.$data.session.evaluated.add(this.pageId);
        this.evaluated = true;
        if (this.allRequired) this.missingRequired.forEach(id => {
            this.$root.$data.session.evaluated.add(id);
        })
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
        reqs.shift()
        let reqIds = this.labels2ids(reqs)
        console.log("Required", reqIds);
        return reqIds;
      } else return []
      
    },
    addRequired () {
        let sc = ''
        this.missingRequired.forEach(id => {
            let node = PageCollection.findOne({_id: id})
            sc += node.data+'\n' // doesn't work for html
        })
        sc+=this.script;
        this.allRequired=true;
        this.myScript = sc
    }
  },
  computed: {
    missingRequired () {
        let reqs = this.getRelationTrans('requires');
        let mreqs = []
        reqs.forEach(r => {
            if (! this.$root.$data.session.evaluated.has(r))
            mreqs.push(r);
        })
        return mreqs
    },
    hasMissing () {
        return this.missingRequired.length;
    },
    mainColSize () {
        return (hasMissing)?11:12;
    },
    isCurrent() {
      let ev = this.evaluated ? "evaluated" : "unevaluated";
      if (this.missingRequired && ! this.evaluated) ev='unavailable'
      const cur = this.currentPage ? "currentPage" : "";
      return cur + " " + ev;
    },
  },
};
</script>

<style scoped>
.unevailable {
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