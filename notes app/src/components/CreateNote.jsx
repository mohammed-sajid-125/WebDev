import React from "react";

const CreateNote = ({
    inputText,
    setInputText,
    saveHandler,
    title,
    setTitle,
    category,
    setCategory
}) => {
    const char = 250;
    const charLimit = char - inputText.length;

    return (
        <div className="note">
            <div className="note_header">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="note_input"
            />

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="note_input"
            />
        </div>

            <textarea
                cols={15}
                rows={10}
                placeholder="Type here something..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={250}
            ></textarea>

            <div className="note_footer">
                <span className="label">{charLimit} Words Left</span>
                <button className="note_save" onClick={saveHandler}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default CreateNote;
