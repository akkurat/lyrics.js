import React from "react";

export interface IHyphenatorProps {
    text: string
}

        const Hypher = require('hypher'), english = require('hyphenation.en-us')
        const h = new Hypher(english);
        function splitSong(song:string) {
            const verses = song.split("\n\n")
            return verses.map(v => <div className="verse">{splitVerse(v)}</div>)
        }

        function splitVerse(verse: string ) {
            const lines = verse.split("\n")
            return lines.map( l => <div className="line">{splitLine(l)}</div>)
        }

        function splitLine(line: string) {
            const words =line.split(' ') 
           return words.map( w => splitWord(w))
        }
        function splitWord(word: string) {
            const syllables = []

            return h.hyphenate(word).map((s,i,a) => 
                <span className={(i==0?'word-start ':'')+(i==a.length-1?' word-end':'')}>{s}</span>
            )
        }
export class Hyphenator extends React.Component<IHyphenatorProps, {hyphenedText: string}> {
    h: any;
    constructor(props) {
        super(props)

    }

    render() {
        return <div>{
            splitSong(this.props.text)
        }
        </div>
    }

}

export class LyricsApp extends React.Component<{},{}> {
}