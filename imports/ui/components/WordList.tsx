import { FunctionComponent, useState, useEffect, Component } from "react";
import React from "react";
import { useTracker, withTracker } from "meteor/react-meteor-data";
import { CSentences, ISentence } from "../../api/sentences";
import { CWords, IWord } from "../../api/words";
import DataTable from "react-data-table-component";
import _, { result } from "underscore";
import { WordListTable } from "./WordListTable";
import { Words } from "../pages/Words";
import { S_IWGRP } from "constants";



interface PresenterWord {
    word: string;
    phonetisations: any[],
    phonetisation_id: string;
}
const WordDisplay: FunctionComponent<{ word: PresenterWord, onClick: (word: string) => void }> = p => {
    const w = p.word;
    return <span onClick={(ev) => { if (ev.metaKey) { p.onClick(w.word) } }}>
        {w.word}
        <i> {w.phonetisations ? '(' + w.phonetisations.map(ph => ph._id).join('|') + ')' : ''}</i>
    </span>
}


export class WordListList_ extends Component<QueryProps & { words, lookupWords, user }, { collectWords: Array<string> }> {

    constructor(props) {
        super(props)
        this.state = { collectWords: [] }
    }

    listener = (ev: KeyboardEvent): void => {

        console.log(ev)
        if (ev.type == 'keydown' && ev.key == 'Alt') {
            this.setState({ collectWords: [] })
        }
        if (ev.type == 'keyup' && ev.key == 'Meta') {

            Meteor.call('words.connect', this.state.collectWords)
            this.setState({ collectWords: [] })
        }

    }

    handleRowClick = (row, ev) => {
        if (ev.metaKey) { this.collectWords(row.word); }
        console.log("row clickt", row)
    }

    private collectWords = (word: string) => {
        this.setState(s => ({ collectWords: [...s.collectWords, word] }));
    }

    componentDidMount() {
        window.addEventListener("keyup", this.listener)

        return () => {
            window.removeEventListener("keyup", this.listener)
        }
    }

    render() {


        const data: PresenterWord[] = this.props.words.map((ev: IWord) => ({
            word: ev._id,
            phonetisations: this.props.lookupWords[ev.phonetisation],
            phonetisation_id: ev.phonetisation
        }))

        if (this.props.words) {

            return <div>
                <ul>{this.state.collectWords.map(w => <li>{w}</li>)}</ul>
                {/* <WordListTable words={this.props.words} lookupWords={this.props.lookupWords}
                    onRowClicked={this.handleRowClick}
                /> */}
                {data.map(w => <WordDisplay key={w.word} word={w} onClick={this.collectWords} />)}
            </div>
        }

        return <div>Loading...</div>

    }
}

interface QueryProps {
    filter: RegExp
    page: number
    pageSize: number
}

const tracker = withTracker((props: QueryProps) => {
    Meteor.subscribe('words');
    const filter = { "_id": props.filter };
    const totalEntries = CWords.find(filter).count()
    const skip = props.page * props.pageSize
    const limit = props.pageSize

    const words = CWords.find(
        filter,
        { sort: { _id: 1 }, limit, skip }
    ).fetch()

    const phonIds = words.map(v => v.phonetisation)

    const lookupWords = _.groupBy(CWords.find({
        $and: [
            { "phonetisation": { $exists: true } },
            { "phonetisation": { $in: phonIds } },
        ]
    }).fetch(), (arg) => arg.phonetisation)
    return ({
        words, totalEntries, lookupWords, user: Meteor.user(),
    });
})

const WordListList = tracker(WordListList_)

export const WordList: FunctionComponent<{}> = () => {

    const [filter, setFilter] = useState("")
    const [page, setPage] = useState(0)
    let regex
    if (filter) {
        regex = RegExp(filter)
    } else {
        regex = /.*/
    }
    return <div>
        <input type="text" onInput={ev => setFilter(ev.target.value)} />
        <WordListList filter={regex} page={page} pageSize={200}/>
        <a onClick={ev => setPage(old => old-1)}>Prev</a>
        <a onClick={ev => setPage(old => old+1)}>Next</a>
    </div>

}