import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Meteor } from 'meteor/meteor'

import { Random } from 'meteor/random'


export interface IWord {
  _id: string;
  phonetisation?: string;
  createdAt: Date
  owner: any
  username: string
}

export const CWords = new Mongo.Collection<IWord>('words');

Meteor.methods({
  'words.insert'(words: string[]) {

    words.forEach(w => check(w, String));

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    words.forEach(w => {

      if (w) {

        console.log("Word:", w)
        CWords.insert({
          _id: w,
          createdAt: new Date,
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username
        })
      }
    })

  },

  'words.remove'(id: string) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    return CWords.remove(id)
  },
  'words.connect'(words: string[]) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    const first = CWords.findOne({ $and: [{ "_id": { $in: words } }, { "phonetisation": { $exists: true } }] })
    let uuid: string
    if (first) {
      uuid = first.phonetisation
    } else {
      uuid = Random.id()
    }
    for (const word of words) {
      CWords.update(word, { $set: { phonetisation: uuid } })
    }
  }


  });

if (Meteor.isServer) {
  Meteor.publish('words', function () {
    return CWords.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  })
}
