import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";

export default function Notes({ match }) {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [attachmentURL, setAttachmentURL] = useState(null);

  const getNote = async () => {
    return await API.get("notes", `/notes/${match.params.id}`);
  };

  useEffect(() => {
    const setNoteFromApi = async () => {
      const note = getNote();
      try {
        const { content, attachment } = note;
        if (attachment) {
          attachmentURL = await Storage.vault.get(attachment);
        }
        setNote(note);
        setContent(content);
        setAttachmentURL(attachmentURL);
      } catch (e) {
        alert(e.message);
      }
    };
    setNoteFromApi();
  });

  return <div className="Notes"></div>;
}
