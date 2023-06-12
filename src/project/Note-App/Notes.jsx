import React from "react";
import Split from "react-split";
import { nanoid } from "nanoid";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import Styles from './sass/notes.module.scss'
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { FirebaseDB, NoteCollection } from "./database/Firebase";

export default function NoteApp () {

    React.useEffect(()=>{
        document.title = 'Note App' // Document Title for NoteApp
    })

    
    // UseState Properties
    
    const [Notes,setNotes] = React.useState([])
    const [CurrentNoteID,setCurrentNoteID] = React.useState('')
    const [TempNotes,setTempNotes] = React.useState('')


            React.useEffect(()=>{
                // Firebase Snapshot Listener
                const Unsubscribe = onSnapshot(NoteCollection,function(snapshot){
                    // Sync Websocket to unsubscribe the snapshot Listener to A LocalStorage Array
                    const NoteArr = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    setNotes(NoteArr)
                })
                return Unsubscribe // Cleaning Websocket by Returning the UseEffect Changes
            },[])
            
            const CurrentNote =
            Notes.find(Note =>  Note.id === CurrentNoteID) 
            || Notes[0]

            React.useEffect(()=>{
                // Check if the Current Note ID exists in Firebase DB
                if(!CurrentNoteID){
                    setCurrentNoteID(Notes[0]?.id)
                }
            },[Notes])


            // Check if there is a current note

            React.useEffect(()=>{
                if(CurrentNote){
                    setTempNotes(CurrentNote.body)
                }
            },[CurrentNote])

            // Delay Request to Firebase DB Changes Everytime for 500ms
        
            React.useEffect(()=>{
                const TimeoutID =  setTimeout(()=>{
                    if(TempNotes !== CurrentNote.body){
                        UpdateNote(TempNotes)
                    }
                },500)
                return ()=> clearTimeout(TimeoutID)
            },[TempNotes])

    // Sorting Notes to recent changes
    const SortedNotes = Notes.sort((a,b) => b.updatedAt - a.updatedAt)
    
            // Create New Notes as Async Function
    async function CreateNewNotes () {
        const NewNote = {
            body: '# Type your markdown notes title here.. #',
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        // Throwing this async function for Firebase FireStore
        const NewNoteRef = addDoc(NoteCollection,NewNote)
        setCurrentNoteID(NewNoteRef.id)
    }

    // Update Current Note

    async function UpdateNote(text) {
        const DocRef = doc(FirebaseDB,"NotesWebpack",CurrentNoteID)
            // This will allow us to bypass any conflict upon merging changes 
            await setDoc(DocRef,{body : text, updatedAt: Date.now()},{merge: true}) 
    }


    // Delete Note

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