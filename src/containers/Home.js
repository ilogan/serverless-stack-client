import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

export default function Home({ isAuthenticated }) {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  console.log(notes);
  useEffect(() => {
    const notes = async () => {
      const notes = await API.get("notes", "/notes");
      setNotes(notes);
    };

    if (!isAuthenticated) {
      return;
    }

    try {
      notes();
    } catch (e) {
      alert(e.message);
    }

    setIsLoading(false);
  }, [isAuthenticated]);

  const renderNotesList = notes => {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  };

  const renderLander = () => {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  };

  const renderNotes = () => {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  };

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
