import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import { Plus } from "lucide-react";
import AddEditNotes from "./AddEditNotes.jsx";
import Modal from "react-modal"


const Home=()=>{
    const [openAddEditModal,setOpenEditModal]=useState({
        isShown: false,
        type: "add",
        date: null
    })
    
    return (
        <>
        <Navbar />
        <div className="container mx-auto">
            <div className="grid grid-cols-3 gap-4 mt-8">
                <NoteCard 
                title="Meeting on 7th April"
                date="3rd April 2024"
                content="Discuss project timeline and deliverables."
                tags="#meeting #project"
                isPlanned={true}
                onEdit={()=>{}}
                onDelete={()=>{}}
                onPinNote={()=>{}}
                />
                <NoteCard 
                title="Meeting on 7th April"
                date="3rd April 2024"
                content="Discuss project timeline and deliverables."
                tags="#meeting #project"
                isPlanned={true}
                onEdit={()=>{}}
                onDelete={()=>{}}
                onPinNote={()=>{}}
                />
                <NoteCard 
                title="Meeting on 7th April"
                date="3rd April 2024"
                content="Discuss project timeline and deliverables."
                tags="#meeting #project"
                isPlanned={true}
                onEdit={()=>{}}
                onDelete={()=>{}}
                onPinNote={()=>{}}
                />
                <NoteCard 
                title="Meeting on 7th April"
                date="3rd April 2024"
                content="Discuss project timeline and deliverables."
                tags="#meeting #project"
                isPlanned={true}
                onEdit={()=>{}}
                onDelete={()=>{}}
                onPinNote={()=>{}}
                />
                <NoteCard 
                title="Meeting on 7th April"
                date="3rd April 2024"
                content="Discuss project timeline and deliverables."
                tags="#meeting #project"
                isPlanned={true}
                onEdit={()=>{}}
                onDelete={()=>{}}
                onPinNote={()=>{}}
                />
                <NoteCard 
                title="Meeting on 7th April"
                date="3rd April 2024"
                content="Discuss project timeline and deliverables."
                tags="#meeting #project"
                isPlanned={true}
                onEdit={()=>{}}
                onDelete={()=>{}}
                onPinNote={()=>{}}
                />
            </div>
        </div>
        <button className="h-16 w-16 flex items-center justify-center rounded-2xl bg-blue-500 text-white p-2 rounded my-1 hover:bg-blue-600 absolute right-10 bottom-10" 
        onClick={()=>{
            setOpenEditModal({isShown:true,type: "add",date:null})
        }}>
            <Plus className="text-[32px] text-white" />
        </button>

        <Modal 
        isOpen={openAddEditModal.isShown}
        onRequestClose={()=>{}}
        style={{
            overlay:{
                backgroundColor: "rgba(0,0,0,0.2)"
            },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        >
        <AddEditNotes 
        type={openAddEditModal.type}
        date={openAddEditModal.date}
        onClose={()=>{
            setOpenEditModal({isShown:false,type:"add",date:null})
        }}
        />

        </ Modal>
        </>
    )
}
export default Home;

