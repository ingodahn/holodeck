Meteor.methods({
    userInsert: function (doc) {
        // Add account
        id = Accounts.createUser({
            username: doc.username,
            password: doc.password,
        });
        Meteor.users.update(id, {
            $set: {
                name: doc.name,
                email: doc.email,
            }
        });
        return id;
    },
    userUpdate: function (doc) {
        // Update account
        const id = doc._id;
        Meteor.users.update(id, {
            $set: {
                username: doc.username,
                name: doc.name,
                email: doc.email,
            }
        });
        let nu = Meteor.users.findOne({name: doc.name});
        // Update password
        if (doc.password) {
            Accounts.setPassword(id, doc.password);
        }

        return true;
    },
    userRemove: function (id) {

        Meteor.users.remove(id);

        return id;
    }
});