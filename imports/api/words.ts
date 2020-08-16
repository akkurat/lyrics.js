import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Meteor } from 'meteor/meteor'

import { Random } from 'meteor/random'
import { ISentence, splitWords, CSentences } from './sentences';


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
        const w_ = w.toLocaleLowerCase()

        console.log("Word:", w_)
        const existing = CWords.findOne(w_)
        if (!existing) {
          CWords.insert({
            _id: w_,
            createdAt: new Date,
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username
          })
        }
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
    for (let i = 0; i < words.length; i++) {
      CWords.update(words[i], { $set: { phonetisation: uuid } })
    }
  },
  'words.mapsentences'() {
    const s = CSentences.find().fetch();
    const map =  extractWords(s)
    return [...map.entries()].map(([k,v]) => [k, [...v.values()]])
  }

});


if (Meteor.isServer) {
  Meteor.publish('words', function () {
    return CWords.find({ owner: this.userId }
    );
  })
}

function extractWords(s: ISentence[]) {



  interface PresenterCaptions {
    id: string;
    caption: string;
  }

  const map = new Map<string, Set<ISentence>>();


  for (const sentence of s) {
    const words = splitWords(sentence.content);
    sentence.words = new Set(words)
    for (const w of words) {
      if (map.has(w)) {
        map.get(w).add((sentence))
      } else {
        const set = new Set<any>()
        set.add((sentence))
        map.set(w, set)
      }
    }
  }

  return map;

}