import { Meteor } from 'meteor/meteor';
import { PageCollection } from '/imports/api/PageCollection';

const insertPage = page => PageCollection.insert(page);

Meteor.startup(() => {
    if (PageCollection.find({type: 'book', title: '|| Free Pages'}).count() === 0) {
        [
            {
                type: 'book',
                title: "|| Free Pages",
                authors: 'Various Authors',
                description: 'Pages not assigned to any book',
                pages: []
              }
        ].forEach(insertPage)
    }
});