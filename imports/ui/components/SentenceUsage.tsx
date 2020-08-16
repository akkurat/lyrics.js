import { FunctionComponent, useState } from "react"
import React from "react"
import { NavLink } from "react-router-dom"
import { ISentence } from "../../api/sentences"

export const UsageList: FunctionComponent<{ title: string, usages: ISentence[] }> = p => {
    const [open, setOpen] = useState(false)

    return <div className={'wordlist ' + (open ? 'open' : 'closed')}>
        <h2 onClick={ev => setOpen(prev => !prev)}>{p.title}:<i>{p.usages.length}</i></h2>
        {
            open ?
                <div className="links">
                    {p.usages.map(v => getSObj(v)).map(v => <NavLink to={v.id}>{v.caption}</NavLink>)}
                </div>
                : null}
    </div>

}
function getSObj(s: ISentence) {
    return { id: s._id, caption: s.content.split(/\n/)[0] }
}

