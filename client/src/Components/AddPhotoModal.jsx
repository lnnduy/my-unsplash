import React from "react";

function AddPhotoModal({
  visible,
  width,
  title,
  children,
  onCancel,
  onConfirm,
  uploading,
}) {
  return (
    visible && (
      <div className={uploading ? "modal loading" : "modal"}>
        <div className="backdrop" />
        <div className="modal-container" style={{ width: width || 400 }}>
          {!uploading && (
            <>
              {!!title && <p className="modal-title">{title.trim()}</p>}
              {children}
              <div className="modal-actions">
                <button className="btn-cancel" onClick={onCancel}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={onConfirm}>
                  Submit
                </button>
              </div>
            </>
          )}
          {uploading && (
            <>
              <p className="upload-card-title" style={{ textAlign: "left" }}>
                Uploading...
              </p>
              <div className="progress-bar">
                <span />
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
}

export default AddPhotoModal;
