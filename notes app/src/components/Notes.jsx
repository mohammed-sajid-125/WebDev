import React, { useEffect, useState } from 'react';
import CreateNote from './CreateNote';
import './notes.css';
import { v4 as uuid } from 'uuid';
import Note from './Note';

const Notes = () => {
  const [inputText, setInputText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState([]);
  const [editToggle, setEditToggle] = useState(null);

  const editHandler = (id, title, category, text) => {
    setEditToggle(id);
    setInputText(text);
    setTitle(title);
    setCategory(category);
  };

  const saveHandler = () => {
    if (!title.trim() || !inputText.trim()) {
      alert("Title and note text are required.");
      return;
    }

    if (editToggle) {
      setNotes(notes.map((note) =>
        note.id === editToggle
          ? { ...note, text: inputText, title, category }
          : note
      ));
    } else {
      setNotes((prevNotes) => [
        ...prevNotes,
        {
          id: uuid(),
          title,
          category,
          text: inputText
        }
      ]);
    }

    setInputText("");
    setTitle("");
    setCategory("");
    setEditToggle(null);
  };

  const deleteHandler = (id) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("Notes"));
    if (data) {
      setNotes(data);
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem("Notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <div className='notes'>
      {notes.map((note) =>
        editToggle === note.id ? (
          <CreateNote
            inputText={inputText}
            setInputText={setInputText}
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            saveHandler={saveHandler}
          />
        ) : (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            category={note.category}
            text={note.text}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
          />
        )
      )}

      {editToggle === null && (
        <CreateNote
          inputText={inputText}
          setInputText={setInputText}
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          saveHandler={saveHandler}
        />
      )}
    </div>
  );
};

export default Notes;
