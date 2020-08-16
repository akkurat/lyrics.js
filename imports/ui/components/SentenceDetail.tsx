import { Component, FunctionComponent } from "react";
import React from "react";
import { CSentences, ISentence } from "../../api/sentences";
import { withTracker } from "meteor/react-meteor-data";

function highlight(line: string, lookup:string[]) {
 const splitRegex = /([^A-Za-z-ÁÀȦÂÄǞǍĂĀÃÅǺǼǢĆĊĈČĎḌḐḒÉÈĖÊËĚĔĒẼE̊ẸǴĠĜǦĞG̃ĢĤḤáàȧâäǟǎăāãåǻǽǣćċĉčďḍḑḓéèėêëěĕēẽe̊ẹǵġĝǧğg̃ģĥḥÍÌİÎÏǏĬĪĨỊĴĶǨĹĻĽĿḼM̂M̄ʼNŃN̂ṄN̈ŇN̄ÑŅṊÓÒȮȰÔÖȪǑŎŌÕȬŐỌǾƠíìiîïǐĭīĩịĵķǩĺļľŀḽm̂m̄ŉńn̂ṅn̈ňn̄ñņṋóòôȯȱöȫǒŏōõȭőọǿơP̄ŔŘŖŚŜṠŠȘṢŤȚṬṰÚÙÛÜǓŬŪŨŰŮỤẂẀŴẄÝỲŶŸȲỸŹŻŽẒǮp̄ŕřŗśŝṡšşṣťțṭṱúùûüǔŭūũűůụẃẁŵẅýỳŷÿȳỹźżžẓǯßœŒçÇ]+)/;
    const out =[]
    const words = line.split(splitRegex)
    for( const word of words) {
        if( lookup.find( w => w == word) ) {
            out.push(<i>{word}</i>)
        } else {
            out.push(word)
        }
    }
    return out
}


export const SimpleParagraphs: FunctionComponent<{content:string, highlight: string[]}>  = p => {
    return <> {p.content.split(/\n{2,}/).map( v => 
        <p>
            {v.split(/\n/).map(vi => [highlight(vi, p.highlight), <br/>]) }
        </p>

        )}
        </>
}


class SentenceStats_ extends Component<ISentenceTrackerProps & { id: string }> {
    render() {

        const s = this.props.sentence
        return <div className="h-100">
            <div className="loading"></div>
            {s ?
                <div className="multicolumn-container">
                    <h1>{s._id}</h1>
                    <SimpleParagraphs content={s.content} />
                </div>
                : null
            }
        </div>


    }


}

export interface ISentenceTrackerProps {
    sentence: ISentence
    user: Meteor.User
}
const tracker = withTracker<ISentenceTrackerProps, { id: string }>(p => {

    Meteor.subscribe('sentences');

    const a: ISentenceTrackerProps = {
        sentence: CSentences.findOne(p.id, { sort: { createdAt: -1 } }),
        user: Meteor.user(),
    }
    return a
})

export const SentenceDetail = tracker(SentenceStats_)