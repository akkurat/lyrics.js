import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Meteor } from 'meteor/meteor'


export interface ITask {
      _id: string;
      text: string
      content: string 
      createdAt: Date
      owner: any
      username: string
      isPrivate?: boolean
      isChecked?: boolean
}

export const CTasks = new Mongo.Collection<ITask>('tasks');

Meteor.methods({
  'tasks.insert'(text: string, content:string) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    CTasks.insert({
      text,
      content,
      createdAt: new Date,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username
    })
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = CTasks.findOne(taskId);

    if (!this.userId || task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    CTasks.remove(taskId);
  },

  'tasks.setChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    const task = CTasks.findOne(taskId);

    if (task.isPrivate && task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    CTasks.update(taskId, {
      $set: {
        isChecked
      }
    });
  },

  'tasks.updateContent'(taskId: string, content: string ) {
    check(taskId, String);
    check(content, String);

    const task = CTasks.findOne(taskId);

    if (!this.userId || task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    CTasks.update(taskId, {
      $set: {
        content
      }
    })
  },

  'tasks.setPrivate'(taskId, isPrivate) {
    check(taskId, String);
    check(isPrivate, Boolean);

    const task = CTasks.findOne(taskId);

    if (!this.userId || task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    CTasks.update(taskId, {
      $set: {
        isPrivate
      }
    })
  }
});

if (Meteor.isServer) {
  Meteor.publish('tasks', function() {
    return CTasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  })
}
