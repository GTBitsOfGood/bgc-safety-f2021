import React from "react";
import PropTypes from "prop-types";

const FileUploader = (props) => {
  const { onChange } = props;

  return (
    <div className="upload-container">
      <label htmlFor="file-upload" className="file-upload">
        <i className="fa fa-plus" />
        Click to upload CSV
        <input
          id="file-upload"
          type="file"
          accept="csv"
          onChange={(event) => onChange(event.target.files)}
        />
      </label>
    </div>
  );
};

FileUploader.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FileUploader;
