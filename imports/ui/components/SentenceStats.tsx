import { Component } from "react";
import React from "react";
import { CSentences, ISentence } from "../../api/sentences";
import { withTracker } from "meteor/react-meteor-data";
import DataTable from 'react-data-table-component'
import { CWords } from "../../api/words";

class SentenceStats_ extends Component<ISentencesTrackerProps> {
    render() {
        const entries = Array.from(this.extractWords().entries())
        entries.sort( (e2,e1) => e1[1].count-e2[1].count )
        const data = entries.map(e => ({ word: e[0], count: e[1].count })) 
        const columns = this.createTable()
        
        return <div>
            <button onClick={ev => this.addToIndex(data)} >ADd to Index</button>
            <DataTable {...{data,columns}} onRowClicked={this.handleRowClicked}></DataTable>
        </div>
    }

    addToIndex(data: {word:string}[]) {
        Meteor.call('words.insert', data.map(w => w.word))
    }

    handleRowClicked(row, ev) {
    }

    createTable() {
        return [
            {name:'Word', selector: 'word'},
            {name:'Count', selector: 'count'}
        ]

    }

    extractWords() {
       const s = this.props.sentences 

       const map = new Map<string, Counter>();

       for( const sentence of s )
       {
           for( const w of sentence.content.split(/[^A-Za-z-ÁÀȦÂÄǞǍĂĀÃÅǺǼǢĆĊĈČĎḌḐḒÉÈĖÊËĚĔĒẼE̊ẸǴĠĜǦĞG̃ĢĤḤáàȧâäǟǎăāãåǻǽǣćċĉčďḍḑḓéèėêëěĕēẽe̊ẹǵġĝǧğg̃ģĥḥÍÌİÎÏǏĬĪĨỊĴĶǨĹĻĽĿḼM̂M̄ʼNŃN̂ṄN̈ŇN̄ÑŅṊÓÒȮȰÔÖȪǑŎŌÕȬŐỌǾƠíìiîïǐĭīĩịĵķǩĺļľŀḽm̂m̄ŉńn̂ṅn̈ňn̄ñņṋóòôȯȱöȫǒŏōõȭőọǿơP̄ŔŘŖŚŜṠŠȘṢŤȚṬṰÚÙÛÜǓŬŪŨŰŮỤẂẀŴẄÝỲŶŸȲỸŹŻŽẒǮp̄ŕřŗśŝṡšşṣťțṭṱúùûüǔŭūũűůụẃẁŵẅýỳŷÿȳỹźżžẓǯßœŒçÇ]/) )
           {
              if (map.has(w)) {
                  map.get(w).inc()
              } else {
                  map.set(w, new Counter())
              } 
           }
       }

       return map;
       
    }

}

class Counter {
    constructor(public count: number=1) {}
    inc() {
        this.count++;
    }
    toString() {
        return this.count
    }
}

export interface ISentencesTrackerProps {
    sentences: ISentence[]
    user: Meteor.User
}
const tracker = withTracker( p => {

    Meteor.subscribe('sentences');

    const a: ISentencesTrackerProps = {
      sentences: CSentences.find({}, {sort: {createdAt: -1}}).fetch(),
      user: Meteor.user(),
    }
    return a
})

export const SentenceStats = tracker(SentenceStats_)