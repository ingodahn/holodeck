import { PageCollection } from "../../api/collections/PageCollection";

let relationMixin = {
    methods: {
        getRelated(relation, nodeSet, direction) {
            const related = new Set()
            if (direction >= 0) {
                for (const node of nodeSet) {
                    PageCollection.find({ name: relation, source: node }).fetch().forEach(nn => {
                        related.add(nn.target)
                    })
                }
            }
            if (direction <= 0) {
                for (const node of nodeSet) {
                    PageCollection.find({ name: relation, target: node }).fetch().forEach(nn => {
                        related.add(nn.source)
                    })
                }
            }
            return related;
        },
        tcClosure(relation, nodeSet, direction,handled=new Set()) {
            let unhandled = nodeSet;
                let related = this.getRelated(relation, unhandled, direction)
                for (const node of unhandled) {
                    handled.add(node)
                }
                unhandled= new Set()
                for (const node of related) {
                    if (!handled.has(node)) unhandled.add(node)
                }
                if (unhandled.size) this.tcClosure(relation,unhandled,direction,handled)
            return handled
        },
        labels2ids(labels) {
            const ids = [];
            labels.forEach(ll => {
                let rel = PageCollection.findOne({ name: 'LabelForId', source: ll })
                if (rel) {
                    ids.push(rel.target)
                }
                else {
                    console.log('RM-46: No Id for',ll)
                    ids.push(ll)
                }
            })
            return ids
        },
        ids2labels(ids) {
            const labels = [];
            ids.forEach(id => {
                let rel = PageCollection.findOne({ name: 'labelForId', target: id })
                if (rel) labels.push(rel.source)
                else labels.push(id)
            })
            return labels
        },
        arrayFromSet(ar, st) {
            const nar = []
            for (let i = 0; i < ar.length; i++) {
                if (st.has(ar[i])) nar.push(ar[i])
            }
            return nar
        }
    }
}

export default relationMixin;