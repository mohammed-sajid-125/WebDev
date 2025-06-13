import React from 'react';

const Note = ({ id, text, title, category, editHandler, deleteHandler }) => {
  return (
    <div className='note'>
      <h3>{title}</h3>
      <small><strong>Category:</strong> {category || 'None'}</small>
      <div className='note-body'>{text}</div>
      <div className='note_footer' style={{ justifyContent: "flex-end" }}>
        <button className='note_save' onClick={() => deleteHandler(id)}>Delete</button> &nbsp;
        <button className='note_save' onClick={() => editHandler(id, title, category, text)}>Edit</button>
      </div>
    </div>
  );
};

export default Note;
