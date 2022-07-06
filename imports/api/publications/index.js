import { Meteor } from 'meteor/meteor';
import { PageCollection } from '../../api/collections/PageCollection.js'

Meteor.publish("AllItems", function () {
    return PageCollection.find({}, { fields: {} });
  });


Meteor.publish("Users", function () {
  var userDetails = Meteor.users.find(
    {}, { fields: { _id: 1} }
  );
  return userDetails;
});