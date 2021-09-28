import React, { useState, useEffect } from "react";
import axios from "axios";
import urls from "../../utils/urls";
import FileUploader from "../components/file_uploader";
import { useSession } from "next-auth/client";
import Router from "next/router";
import { verifyUserType } from "../../utils/userType";

const CSVUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [sentFile, setSentFile] = useState(false);
  const [session, loading] = useSession();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    session && verifyUserType(session, urls.pages.csv_upload, setUserType);
  }, [session]);

  const handleUpload = (files) => {
    let fileName = files[0].name;
    fileName = fileName.split(".");
    if (fileName[fileName.length - 1] == "csv") {
      setSelectedFile(files[0]);
      setUploadedFile(true);
    } else {
      alert("You must upload a CSV file!");
    }
  };

  const sendCsv = () => {
    console.log("Uploading...");
    const data = new FormData();
    data.append("file", selectedFile);
    console.log(selectedFile);
    axios
      .post(`${urls.baseUrl}/api/upload_csv`, data)
      .then(function (response) {
        console.log("Uploaded file!! ... ", response);
        setUploadedFile(false);
        setSentFile(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const clearFile = () => {
    console.log("Clearing file");
    setSelectedFile(undefined);
    setUploadedFile(false);
  };

  return (
    <>
      {session && userType === "Admin" ? (
        <div className="container">
          <div>
            <div>
              <bold className="label">Title:</bold>
              <input className="text-field" placeholder="Type here" />
            </div>
            <div>
              <bold className="label">Upload:</bold>
              {!(uploadedFile || sentFile) && (
                <FileUploader onChange={(files) => handleUpload(files)} />
              )}
              {uploadedFile && (
                <div className="uploaded-container">
                  <div className="file-upload">
                    <i className="fa fa-check" />
                    Received File! Click "Upload" to submit
                  </div>
                </div>
              )}
              {sentFile && (
                <div className="uploaded-container">
                  <div className="file-upload">
                    <i className="fa fa-check" />
                    File Uploaded!
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="button-container">
            <button
              type="button"
              className="btn btn-danger"
              onClick={clearFile}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-success" onClick={sendCsv}>
              Upload
            </button>
          </div>
        </div>
      ) : (
        <div />
      )}
    </>
  );
};

export default CSVUpload;
