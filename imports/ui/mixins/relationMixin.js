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
        // Getting list of related nodes that contains source befor target
        getRelatedList(relation, nodeList, direction) {
            const related = [];
            if (direction >= 0) {
                for (let i=0; i< nodeList.length; i++) {
                    let node=nodeList[i];
                    PageCollection.find({ name: relation, source: node }).fetch().forEach(nn => {
                        if (!related.includes(nn.target)) related.push(nn.target);
                    })
                }
            }
            if (direction <= 0) {
                for (let i=nodeList.length-1; i>=0; i--) {
                    let node=nodeList[i];
                    PageCollection.find({ name: relation, target: node }).fetch().forEach(nn => {
                        if (!related.includes(nn.source)) related.unshift(nn.source)
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
        tcClosureList(relation, nodeList, direction,handled=[]) {
            let unhandled = nodeList;
                let related = this.getRelatedList(relation, unhandled, direction)
                if (direction >=0) {
                    for (let i=0; i< unhandled.length; i++) {
                        if (!handled.includes(unhandled[i])) handled.push(unhandled[i]);
                    }
                }
                if (direction <=0) {
                    for (let i=unhandled.length-1; i>=0; i--) {
                        if (!handled.includes(unhandled[i])) handled.unshift(unhandled[i]);
                    }
                }
                unhandled= [];
                for (let i=0; i< related.length; i++) {
                    if (!handled.includes(related[i])) unhandled.push(related[i])
                }
                if (unhandled.length >0) {
                    this.tcClosureList(relation,unhandled,direction,handled);
                }
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
                    ids.push(ll)
                }
            })
            return ids
        },
        ids2labels(ids) {
            const labels = [];
            ids.forEach(id => {
                let rel = PageCollection.findOne({ name: 'LabelForId', target: id })
                if (rel) labels.push(rel.source)
                else labels.push(id)
            })
            return labels
        },
        bookLabel(pageLabel) {
            let i = pageLabel.indexOf('/');
            if (i > 0) {
                return pageLabel.slice(0, i);
            }
            else {
                return '';
            }
        },
        
        bookLabels(pageSet) {
            const labels = new Set();
            pageSet.forEach(pageLabel => {
                let bl=this.bookLabel(pageLabel)
                if (bl) labels.add(bl);
            });
            return labels;
        },
        // Sort page Ids for labels according to book order
        sortBookLabelIds(pageLabels,bookLabel) {
            const sorted=[];
            let bookId=this.labels2ids([bookLabel])[0];
            let pageIds = this.labels2ids(pageLabels);
            let bookPages=PageCollection.findOne({_id: bookId}).pages;
            let filteredPages=bookPages.filter(pageId => pageIds.includes(pageId));
            return filteredPages;
        }
    }
}

export default relationMixin;