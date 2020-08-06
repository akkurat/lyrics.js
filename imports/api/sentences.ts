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

export const CSentences = new Mongo.Collection<ISentence>('sentences');

Meteor.methods({
  'sentences.insert'(content: string, splitlines: boolean) {
    check(content, String);
    check(splitlines, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if (splitlines) {
      content.split(/\n{2,}/).forEach(line => {
        CSentences.insert({
          content: line,
          createdAt: new Date,
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username
        })
      })
    } else {
      CSentences.insert({
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
    return CSentences.remove(id)
  }


});

if (Meteor.isServer) {
  Meteor.publish('sentences', function () {
    return CSentences.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  })
}
