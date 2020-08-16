import { ISentence } from "../../api/sentences";
import { useState, useCallback } from "react";
import React from "react";
import { SimpleParagraphs } from "./SentenceDetail";
import { ServerHttp2Session } from 'http2';

export function Correlations(p: { s: ISentence[], wordmap: Map<string, Set<ISentence>> }) {
    console.log('outerCor')

    const [sel, setSel] = useState<ICorrelationObject>()

    const handleSelection = useCallback(v => { setSel(v) }, [])

    function unsetContent(ev) {
        setSel(null)
    }

    return <>
        <div className="songcorrelations" onClick={unsetContent} >
            <div className="s-overview" >
                <CorrelationsComponent wordmap={p.wordmap} s={p.s} onSelection={handleSelection} />
            </div>
            {sel ? <>
                <div><SimpleParagraphs highlight={sel.matches} content={sel.s1.content} /></div>
                <div><SimpleParagraphs highlight={sel.matches} content={sel.s2.content} /></div>
            </> : null}
        </div>
    </>
}

interface ICorrelationObject {
    s1: ISentence
    s2: ISentence
    matchValue: number
    matches: string[]
}

function correlateAll(s: ISentence[], wordmap: Map<string, Array<ISentence>>, threshold: number = 100) {
    const rowObject: ICorrelationObject[] = []
    for (let i = 0; i < s.length; i++) {
        const s1 = s[i]

        for (let j = i; j < s.length; j++) {
            const s2 = s[j]
            const matches = correlation(s1, s2)

                .filter(v => wordmap.get(v)?.length < threshold)
            const matchValue = matches
                .map( v => wordmap.get(v).length )
                .map( num => 1/num)
                .reduce((add, sum) => sum + add, 0);
            rowObject.push({ s1, s2, matchValue, matches })
        }
    }

    console.log('calculate')
    return rowObject;
}
const CorrelationsComponent = React.memo((p: { s: ISentence[], wordmap: Map<string, Set<ISentence>>, onSelection: (s: ICorrelationObject) => void }) => {


    const [thresHold, setThresHold] = useState("50")
    const rows_ = correlateAll(p.s, p.wordmap,Number(thresHold))
    rows_.sort((a, b) => b.matchValue - a.matchValue)

    const rows = rows_.slice(0, 250).map(v =>
        <li onClick={ev => { ev.stopPropagation(); p.onSelection(v) }} className="padding-all" title={v.matches.join('|')}>
            {v.matchValue.toPrecision(2)}
            {v.s1.content.split(/\n/)[0]}
            {v.s2.content.split(/\n/)[0]}
        </li>
    )

    const cb = useCallback(ev => setThresHold(ev.currentTarget.value),[])
    console.log('memo')
    return <>
        <input type="number" min="1" max="2000" defaultValue={thresHold} onInput={cb} />
        <ul>{rows}</ul>
    </>
})

function correlation(s1: ISentence, s2: ISentence) {

    let returnValue = []

    if (s1.words && s2.words) {
        if (s1 == s2) {
            return returnValue
        }
        const lookUp = new Set(s2.words)
        s1.words.forEach(v => {
            if (lookUp.has(v)) {
                returnValue.push(v)
            }
        })
    }
    return returnValue

}