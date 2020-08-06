import * as React from "react";
import { useTracker, withTracker } from "meteor/react-meteor-data";
import { CSentences, ISentence } from "../../api/sentences";
import { CWords, IWord } from "../../api/words";
import DataTable from "react-data-table-component";
import _ from "underscore";


export class WordListTable extends React.PureComponent<{ words: IWord[], lookupWords:IWord[], user?: Meteor.User, onRowClicked: (row: IWord, ev: MouseEvent)=>void, }, {}> {


    listener = (ev: KeyboardEvent): void => {

        console.log(ev)
        // if (ev.key == 'Meta') {
        //     this.setState({ collectWords: [] })
        // }
    }


    // shouldComponentUpdate(newtProps, nextState){
    //     console.log(newtProps,nextState)
    //    return true; 
    // }

    render() {
        console.log('rerendering table')

        const columns = [{
            name: 'Word',
            selector: 'word',
            sortable: true,
        }, {
            name: 'Phonetisations',
            selector: 'phonetisations'
        }]
        const words = this.props.words

        const data = words.map(ev => ({ word: ev._id, phonetisations: this.props.lookupWords[ev.phonetisation] }))

        if (words) {

            return <div>
                <DataTable {...{ columns, data }}
                    selectableRows selectableRowsHighlight
                    onRowClicked={this.props.onRowClicked}
                />
            </div>
        }

        return <div>Loading...</div>

    }
}
