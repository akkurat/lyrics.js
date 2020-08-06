import { Meteor } from 'meteor/meteor';
import '/imports/api/tasks';
import '/imports/api/sentences';
import '/imports/api/words';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername('gagi')) {
    Accounts.createUser({
      username: 'gagi',
      password: 'gagi'
    });
  }
});
