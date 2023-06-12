import React from "react";
import MDEditor from "@uiw/react-md-editor";
import Showdown from "showdown";
import Styles from '../sass/notes.module.scss'

export default function Editor({ TempNotes,setTempNotes}) {

    // using Converter in Showdown Dep

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    })

    return (
        <section className={Styles['pane editor']}>
            <MDEditor
                value={TempNotes}
                onChange={setTempNotes}
                height={900}
            />
        </section>
    )
}

