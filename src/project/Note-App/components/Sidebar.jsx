import React from "react";
import Styles from '../sass/notes.module.scss'
import { Join } from "../../../assets/util/JoinClasses";
import '../sass/emoji-icon/emoji.scss'

export default function Sidebar(props){
    const NoteElements = props.Notes.map((Note,index) => (
        <div key={Note.id}>
            <div
                className={Join([Styles.title,Note.id === props.CurrentNote.id ? Styles['selected-note'] : ''])}
                onClick={() => props.setCurrentNoteID(Note.id)}
            >
                <h4 className={Styles['text-snippet']}> <span className='em book'></span> {Note.body.split("\n")[0]}</h4>
                <button 
                    className={Styles["delete-btn"]}
                    onClick={() => props.DeleteNote(Note.id)}
                    // Your onClick event handler here
                >
                    <span className="em trash"></span>
                </button>

            </div>
        </div>
    ))

    return (
        <section className={Styles['pane sidebar']}>
            <div className={Styles['sidebar--header']}>
                <h3 className={Styles.weight}> <span className="em book"></span> Notes</h3>
                <button 
                    className={Styles['new-note']}
                    onClick={props.NewNote}
                    > 
                    <span className="em plus"></span>
                </button>
            </div>
            {NoteElements}
        </section>
    )
}