<template>
  <div class="container" :name="cellName">
    <div v-html="makeCell"></div>
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
    cellName: {
      type: String,
      default: 'sagecell'
    },
    options: {
      type: Object,
      default() {
        return {
          // Make *any* div with class 'compute' a Sage cell
          inputLocation: "div.compute",
          //languages: sagecell.allLanguages,
          //languages: ["maxima","sage","singular","r"],
          languages: ["sage"],
          evalButtonText: "Evaluate",
          linked: true,
          linkKey: "Holodeck",
          callback: () => {
            let node = document.getElementsByName(this.cellName)[0];
            let bt = node.getElementsByClassName("sagecell_evalButton");
            bt[0].addEventListener("click", this.isEvaluated);
          },
        };
      },
    },
  },
  data() {
    return {
      session: this.$root.$data.session,
      evaluated: this.$root.$data.session.evaluated.has(this.cellName),
    };
  },
  created () {
    
  },
  mounted() {
    sagecell.makeSagecell(this.options);
  },
  methods: {
    isEvaluated() {
      this.$emit('evaluated')
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
  },
};
</script>
