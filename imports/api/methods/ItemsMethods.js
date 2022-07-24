import { check, Match } from 'meteor/check';
import { PageCollection } from '../collections/PageCollection';

Meteor.methods({
    insertItem(item) {
        if (!this.userId) {
            throw new Meteor.Error('Insert not authorized');
        }
        const pattern = Match.ObjectIncluding({ type: Match.OneOf("book", "code-cell", "markdown-cell", "markdown", "code","relation") });
        var myTest = Match.test(item, pattern);
        if (myTest) {
            var newId = PageCollection.insert(item);
            return newId;
        } else {
            console.log("Insert: Illegal Pattern");
        }
    },
    updateItem(item) {
        if (!this.userId) {
            throw new Meteor.Error('Update not authorized');
        }
        const pattern = Match.ObjectIncluding({
            _id: String,
            type: Match.OneOf("book", "code-cell", "markdown-cell", "markdown", "code", "relation")
        });
        var myTest = Match.test(item, pattern);
        if (myTest) {
            PageCollection.update(
                { _id: item._id },
                {
                    $set: item
                }
            );
        } else {
            throw new Meteor.Error("Update: Illegal Type or _id");
        }
    },
    deleteItem(pattern) {
        if (!pattern instanceof Object) {
            throw new Meteor.Error('Delete: Pattern is not an object');
        }
        if (!this.userId) {
            throw new Meteor.Error('Deleting not authorized');
        }
        PageCollection.remove(pattern);
    }
})