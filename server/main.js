import { Meteor } from 'meteor/meteor';
import '/imports/api/tasks';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername('gagi')) {
    Accounts.createUser({
      username: 'gagi',
      password: 'gagi'
    });
  }
});
