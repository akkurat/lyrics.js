import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Meteor } from 'meteor/meteor'

export enum TextType {
  PHRASE,
  FRAGMENT,
  SONG
}

export interface ISentence {
  _id: string;
  content: string
  type: TextType
  createdAt: Date
  owner: any
  username: string
}

export const CSentences = new Mongo.Collection<ISentence>('sentences');

Meteor.methods({
  'sentences.insert'(content: string, type: string, splitlines: boolean) {
    check(content, String);
    check(type, String);
    check(splitlines, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    

    if (splitlines) {
      let regex = /\n{2,}/
      if( type == 'SONG' )
      {
        regex = /\n={5}/
      }

      content.split(regex).forEach(line => {
        CSentences.insert({
          content: line,
          type: type,
          createdAt: new Date,
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username
        })
      })
    } else {
      CSentences.insert({
        content,
        type: type,
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
