<template>
  <div class="container">
    <v-row>
      <v-col>
        <div :class="isCurrent" :name="pageId">
          <div v-html="makeCell"></div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script src="https://sagecell.sagemath.org/embedded_sagecell.js"></script>

<script>
export default {
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
  data() {
    return {
      session: this.$root.$data.session,
      evaluated: this.$root.$data.session.evaluated.has(this.pageId),
    };
  },
  mounted() {
    // Make *any* div with class 'compute' a Sage cell
    sagecell.makeSagecell({
      inputLocation: "div.compute",
      //languages: sagecell.allLanguages,
      //languages: ["maxima","sage","singular","r"],
      languages: ["sage"],
      evalButtonText: "Evaluate",
      linked: true,
      linkKey: "Holodeck",
      callback: () => {
        let node = document.getElementsByName(this.pageId)[0];
        let bt = node.getElementsByClassName("sagecell_evalButton");
        bt[0].addEventListener("click", this.isEvaluated);
      },
    });
  },
  watch: {
    evaluated(newValue) {
      if (newValue == true) this.session.evaluated.add(this.pageId);
    },
  },
  methods: {
    isEvaluated() {
      this.evaluated = true;
    },
  },
  computed: {
    makeCell() {
      return (
        '<div class="compute"><script type="text/x-sage">' +
        this.script +
        "<\/script></div>"
      );
    },
    isCurrent() {
      const ev = this.evaluated ? "evaluated":"unevaluated";
      const cur = this.currentPage ? "currentPage" : "";
      return cur + " " + ev;
    },
  },
};
</script>

<style scoped>
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