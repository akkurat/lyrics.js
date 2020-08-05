import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Meteor } from 'meteor/meteor'


export interface ISentence {
  _id: string;
  content: string
  createdAt: Date
  owner: any
  username: string
  isPrivate?: boolean
  isChecked?: boolean
}

export const Sentences = new Mongo.Collection<ISentence>('sentences');

Meteor.methods({
  'sentences.insert'(content: string, splitlines: boolean) {
    check(content, String);
    check(splitlines, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if (splitlines) {
      content.split(/\n{2,}/).forEach(line => {
        Sentences.insert({
          content: line,
          createdAt: new Date,
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username
        })
      })
    } else {
      Sentences.insert({
        content,
        createdAt: new Date,
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username
      })
    }

  },

  'sentences.remove'(id: string) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    return Sentences.remove(id)
  }


});

if (Meteor.isServer) {
  Meteor.publish('sentences', function () {
    return Sentences.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  })
}
