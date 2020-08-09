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


export class WordListList_ extends Component<{ worddata: { words, lookupWords, user } }, { collectWords: Array<string> }> {

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

        const wd = this.props.worddata;

        const data: PresenterWord[] = wd.words.map((ev: IWord) => ({
            word: ev._id,
            phonetisations: wd.lookupWords[ev.phonetisation],
            phonetisation_id: ev.phonetisation
        }))

        if (wd.words) {

            return <div>
                <ul className="inline-list">{this.state.collectWords.map(w => <li>{w}</li>)}</ul>
                {/* <WordListTable words={this.props.words} lookupWords={this.props.lookupWords}
                    onRowClicked={this.handleRowClick}
                /> */}
                <div className="flex-v">
                {data.map(w => <WordDisplay key={w.word} word={w} onClick={this.collectWords} />)}
                </div>
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


export const WordList: FunctionComponent<{}> = () => {

    const pageSize = 500

    const [filter, setFilter] = useState("")
    const [page, setPage] = useState(0)
    let regex
    if (filter) {
        regex = RegExp(filter)
    } else {
        regex = /.*/
    }
    const worddata = useTracker(() => {
        Meteor.subscribe('words');
        const filter = { "_id": regex };
        const totalEntries = CWords.find(filter).count()
        const skip = page * pageSize
        const limit = pageSize

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

    const pages = Math.ceil( worddata.totalEntries / pageSize )

    const pageNums = Array.from(new Array(pages).keys())

    const paging = <div>
        {pageNums.map(idx => <a onClick={ev => setPage( idx )}>{idx+1}</a>)}
        <a onClick={ev => setPage(old => old - 1)}>Prev</a>
        <a onClick={ev => setPage(old => old + 1)}>Next</a>
        </div>
    return <div>
        <input type="text" onInput={ev => setFilter(ev.target.value)} />
        {paging}
        <WordListList_ worddata={worddata} />
        {paging}
    </div>

}