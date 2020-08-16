import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Meteor } from 'meteor/meteor'

export enum TextType {
  PHRASE,
  FRAGMENT,
  SONG
}

export interface ISentence {
  words: Set<string>;
  _id: string;
  content: string
  type: TextType
  createdAt: Date
  owner: any
  username: string
}

export const CSentences = new Mongo.Collection<ISentence>('sentences', { 
  transform: s => { s.words = splitWords(s.content); return s}
});

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

export const splitRegex = /[^A-Za-z-ÁÀȦÂÄǞǍĂĀÃÅǺǼǢĆĊĈČĎḌḐḒÉÈĖÊËĚĔĒẼE̊ẸǴĠĜǦĞG̃ĢĤḤáàȧâäǟǎăāãåǻǽǣćċĉčďḍḑḓéèėêëěĕēẽe̊ẹǵġĝǧğg̃ģĥḥÍÌİÎÏǏĬĪĨỊĴĶǨĹĻĽĿḼM̂M̄ʼNŃN̂ṄN̈ŇN̄ÑŅṊÓÒȮȰÔÖȪǑŎŌÕȬŐỌǾƠíìiîïǐĭīĩịĵķǩĺļľŀḽm̂m̄ŉńn̂ṅn̈ňn̄ñņṋóòôȯȱöȫǒŏōõȭőọǿơP̄ŔŘŖŚŜṠŠȘṢŤȚṬṰÚÙÛÜǓŬŪŨŰŮỤẂẀŴẄÝỲŶŸȲỸŹŻŽẒǮp̄ŕřŗśŝṡšşṣťțṭṱúùûüǔŭūũűůụẃẁŵẅýỳŷÿȳỹźżžẓǯßœŒçÇ]/;
export function splitWords(line: string) {
    return line.split(splitRegex);
}