import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import { Plus } from "lucide-react";
import AddEditNotes from "./AddEditNotes.jsx";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Message from "../../components/Message/Message.jsx";
import AddNotesImg from "../../assets/Images/add-notes.svg";
import NoDataImg from "../../assets/Images/no-notes.png";
import EmptyCard from "../../components/EmptyCard/EmptyCard.jsx";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showMsg, setShowMsg] = useState({
    isShown: false,
    type: "add",
    message: "",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleCloseMsg = () => {
    setShowMsg({ isShown: false, message: "" });
  };

  const showMessage = (message, type) => {
    setShowMsg({ isShown: true, message, type });
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Pin/Unpin Note
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    const newPinnedStatus = !noteData.isPinned;

    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        isPinned: newPinnedStatus,
      });

      if (response.data && response.data.note) {
        showMessage(
          newPinnedStatus ? "Note pinned successfully" : "Note unpinned successfully"
        );
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Search Notes
  const onSearchNote = async (query) => {
    if (!query) {
      setIsSearch(false);
      getAllNotes();
      return;
    }

    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto mt-6">
        {userInfo && (
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome back, <span className="text-indigo-600">{userInfo.fullName}</span>!
          </h2>
        )}

        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPlanned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={
              isSearch
                ? "Oops! No notes found matching your Search"
                : "Your notes start here. Click the 'Add' button to write down your thoughts, ideas, and reminders, and begin your journey."
            }
          />
        )}
      </div>

      <button
        className="fixed bottom-10 right-10 h-16 w-16 flex items-center justify-center rounded-2xl 
                   bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-105 transition duration-200"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <Plus className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
          showMessage={showMessage}
        />
      </Modal>

      <Message
        isShown={showMsg.isShown}
        type={showMsg.type}
        message={showMsg.message}
        onClose={handleCloseMsg}
      />
    </>
  );
};

export default Home;
