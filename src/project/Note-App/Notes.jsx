import React from "react";
import Split from "react-split";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import Styles from './sass/notes.module.scss'
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { FirebaseDB, NoteCollection } from "./database/Firebase";

export default function NoteApp () {

    React.useEffect(()=>{
        document.title = 'Note App' // Document Title for NoteApp
    })
    
    const [Notes,setNotes] = React.useState([])
    const [CurrentNoteID,setCurrentNoteID] = React.useState('')
    const [TempNotes,setTempNotes] = React.useState('')

            React.useEffect(()=>{
                const Unsubscribe = onSnapshot(NoteCollection,function(snapshot){
                    const NoteArr = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    setNotes(NoteArr)
                })
                return Unsubscribe 
            },[])
            
            const CurrentNote =
            Notes.find(Note =>  Note.id === CurrentNoteID) 
            || Notes[0]

            React.useEffect(()=>{
                if(!CurrentNoteID){
                    setCurrentNoteID(Notes[0]?.id)
                }
            },[Notes])

            React.useEffect(()=>{
                if(CurrentNote){
                    setTempNotes(CurrentNote.body)
                }
            },[CurrentNote])

            React.useEffect(()=>{
                const TimeoutID =  setTimeout(()=>{
                    if(TempNotes !== CurrentNote.body){
                        UpdateNote(TempNotes)
                    }
                },500)
                return ()=> clearTimeout(TimeoutID)
            },[TempNotes])

    const SortedNotes = Notes.sort((a,b) => b.updatedAt - a.updatedAt)
    
    async function CreateNewNotes () {
        const NewNote = {
            body: '# Type your markdown notes title here.. #',
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
   
        const NewNoteRef = addDoc(NoteCollection,NewNote)
        setCurrentNoteID(NewNoteRef.id)
    }

    async function UpdateNote(text) {
        const DocRef = doc(FirebaseDB,"NotesWebpack",CurrentNoteID)
           
            await setDoc(DocRef,{body : text, updatedAt: Date.now()},{merge: true}) 
    }

    async function DeleteNote(NoteID) {
        const DocRef = doc(FirebaseDB,"NotesWebpack",NoteID)
        await deleteDoc(DocRef)
    }

    return (
        <main>
            {
                Notes.length > 0
                ?
                <Split
                    sizes={[30,70]}
                    direction="horizontal"
                    className={Styles.split}
                >
                    <Sidebar 
                        Notes={SortedNotes}
                        CurrentNote={CurrentNote}
                        setCurrentNoteID={setCurrentNoteID}
                        NewNote={CreateNewNotes}
                        DeleteNote={DeleteNote}
                    />

                        <Editor
                            TempNotes={TempNotes}
                            setTempNotes={setTempNotes}
                        />

                </Split>
                :
                <div className={Styles['no-notes']}>
                    <h1 className={Styles.Notes}>
                        <span className="em pen"></span>
                        You have no notes
                        </h1>
                    <button
                        className={Styles['first-note']}
                        onClick={CreateNewNotes}
                    >
                        Create one now
                    </button>
                </div>
            }
        </main>
    )
}