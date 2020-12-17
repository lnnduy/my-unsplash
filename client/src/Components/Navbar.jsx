import React, { useRef, useState } from "react";
import AddPhotoModal from "./AddPhotoModal";
import axios from "axios";
import image from "../image.svg";
import { actions } from "../store";
import { useDispatch } from "react-redux";

function Navbar() {
  const dispatch = useDispatch();
  const dropZoneRef = useRef(null);
  const browseFileRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadFrom, setUploadFrom] = useState("URL");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [url, setUrl] = useState(null);
  const [label, setLabel] = useState(null);

  const preventDefault = (e, isDragOver = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDragOver === null) return;

    setIsDragOver(isDragOver);
  };

  const sendRequest = async (formData) => {
    try {
      console.log("Bearer " + localStorage.getItem("token"));
      const res = await axios.post(
        `/api/photos/${uploadFrom.toLowerCase()}`,
        formData,
        {
          headers: {
            "Content-Type": "application/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      setUploading(false);
      return null;
    }
  };

  const handleResponse = (resData) => {
    const { success, data, errorCode } = resData;

    if (!success) {
      console.log(errorCode);
      setUploading(false);
      return;
    }

    dispatch(actions.addPhoto(data));
    setShowAddPhotoModal(false);
    setUploading(false);
  };

  const resetStates = () => {
    setShowAddPhotoModal(false);
    setUploading(false);
    setFile(null);
    setUrl(null);
    setLabel(null);
  };

  const addPhoto = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("label", label);
      setUrl(uploadFrom === "URL" ? url : null);
      formData.append("url", url);
      setFile(uploadFrom === "URL" ? null : file);
      formData.append("image", file);
      const res = await sendRequest(formData);

      if (res === null) return;

      handleResponse(res.data);

      resetStates();
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.dataTransfer.files[0]);
    setIsDragOver(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/devchallenges.png"
            style={{
              width: 30,
              height: 30,
              marginRight: 50,
            }}
          />
          <div style={{ position: "relative", color: "#505050" }}>
            <span
              className="material-icons"
              style={{ position: "absolute", top: 8, left: 15, fontSize: 26 }}
            >
              search
            </span>
            <input
              style={{
                borderRadius: 12,
                width: 300,
                height: 40,
                padding: "8px 20px 8px 50px",
                fontSize: 16,
                border: "1px solid #bdbdbd",
                boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.1)",
                outline: "none",
              }}
              placeholder="Search by name"
              onChange={(e) =>
                dispatch(actions.setSearchString(e.target.value))
              }
            />
          </div>
        </div>
        <div>
          <button
            style={{
              height: 40,
              padding: "0 20px",
              border: "none",
              borderRadius: 12,
              backgroundColor: "#3DB46D",
              color: "white",
              fontWeight: 700,
              boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => setShowAddPhotoModal(true)}
          >
            Add a photo
          </button>
        </div>
      </div>
      <AddPhotoModal
        visible={showAddPhotoModal}
        title="Add a new photo"
        onCancel={() => setShowAddPhotoModal(false)}
        onConfirm={addPhoto}
        uploading={uploading}
      >
        <form className="form">
          <div className="form-control">
            <label>Upload from:</label>
            <button
              onClick={(e) => {
                e.preventDefault();
                setUploadFrom("URL");
              }}
              className={`btn-upload-from-url${
                uploadFrom === "URL" ? " selected" : ""
              }`}
            >
              URL
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setUploadFrom("PC");
              }}
              className={`btn-upload-from-pc${
                uploadFrom === "PC" ? " selected" : ""
              }`}
            >
              My PC
            </button>
          </div>
          {uploadFrom === "URL" && (
            <>
              <div className="form-control">
                <label>Label</label>
                <input
                  name="label"
                  placeholder="Suspendisse edit massa"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                ></input>
              </div>
              <div className="form-control">
                <label>Url</label>
                <input
                  name="label"
                  placeholder="https://asdfasdfasf.com/asfsadfas.png"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                ></input>
              </div>
            </>
          )}
          {uploadFrom === "PC" && (
            <>
              <div className="form-control">
                <label>Label</label>
                <input
                  name="label"
                  placeholder="Suspendisse edit massa"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                ></input>
              </div>
              <div
                ref={dropZoneRef}
                className={isDragOver ? "drop-zone is-drag-over" : "drop-zone"}
                onDrag={preventDefault}
                onDragStart={(e) => preventDefault(e, true)}
                onDragEnter={(e) => preventDefault(e, true)}
                onDragOver={(e) => preventDefault(e, true)}
                onDragEnd={(e) => preventDefault(e, false)}
                onDragLeave={(e) => preventDefault(e, false)}
                onDragExit={(e) => preventDefault(e, false)}
                onDrop={handleDrop}
                onClick={() => browseFileRef.current.click()}
              >
                <img src={image} className="drop-zone-image" />
                <p className="drop-zone-placeholder">
                  Drop your image here
                  <br /> or <br />
                  Click here to choose a image
                </p>
              </div>
              <input
                ref={browseFileRef}
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </>
          )}
        </form>
      </AddPhotoModal>
    </div>
  );
}

export default Navbar;
