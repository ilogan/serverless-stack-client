import React, { useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";

export default function NewNote() {
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(null);
  const [content, setContent] = useState("");

  const validateForm = () => {
    return content.length > 0;
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

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl
            onChange={e => setContent(e.target.value)}
            value={content}
            componentClass="textarea"
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={e => setFile(e.target.files[0])} type="file" />
        </FormGroup>
        <LoaderButton
          block
          bsStyle="primary"
          bsSize="large"
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Create"
          loadingText="Creating…"
        />
      </form>
    </div>
  );
}
