import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { PageCollection } from '/imports/api/collections/PageCollection';
import '/imports/api/publications';
import '/imports/api/methods/UserMethods';
import '/imports/api/methods/ItemsMethods';

const insertPage = page => PageCollection.insert(page);
const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'admin';

Meteor.startup(() => {
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
          username: SEED_USERNAME,
          password: SEED_PASSWORD,
        });
    }
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