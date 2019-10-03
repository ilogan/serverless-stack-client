import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import config from "../config";

import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

import "./Notes.css";

export default function Notes({ match }) {
  const [isLoading, setIsLoading] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [attachmentURL, setAttachmentURL] = useState(null);

  const getNote = async () => {
    return await API.get("notes", `/notes/${match.params.id}`);
  };

  useEffect(() => {
    const setNoteFromApi = async () => {
      let attachmentURL;
      const note = await getNote();
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

  const validateForm = () => {
    return content.length > 0;
  };

  const formatFilename = str => {
    return str.replace(/^\w+-/, "");
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);
  };

  const handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
  };

  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={e => setContent(e.target.value)}
              value={content}
              componentClass="textarea"
            />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl
              onChange={e => setFile(e.target.files[0])}
              type="file"
            />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Save"
            loadingText="Saving…"
          />
          <LoaderButton
            block
            bsStyle="danger"
            bsSize="large"
            isLoading={isDeleting}
            onClick={handleDelete}
            text="Delete"
            loadingText="Deleting…"
          />
        </form>
      )}
    </div>
  );
}
