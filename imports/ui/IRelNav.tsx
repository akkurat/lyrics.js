import React, { FunctionComponent } from "react"
import { NavLink } from "react-router-dom"

export interface IRelNav {
    relpath: string
    caption: string
    children?: IRelNav[]
}
export const RelNavComponent: FunctionComponent<{ parentPath: string, paths: IRelNav[] }> = (p) =>

    <ul>
        {p.paths.map(node => <li>
            <NavLink to={p.parentPath + node.relpath}>{node.caption}</NavLink>
            {node.children ? <RelNavComponent parentPath={p.parentPath+node.relpath + '/'} paths={node.children} /> : null}
        </li>
        )}
    </ul>