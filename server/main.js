import { Meteor } from 'meteor/meteor';
import { PageCollection } from '/imports/api/PageCollection';

const insertPage = page => PageCollection.insert(page);

Meteor.startup(() => {
    if (PageCollection.find().count() === 0) {
        [
            {
                type: "html",
                title: "My first page",
                data: "<h1>This is the first page</h1>"
            }
        ].forEach(insertPage)
    }
});