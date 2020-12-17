import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { actions } from "../store";
import { useDispatch, useSelector } from "react-redux";
import AddPhotoModal from "../Components/AddPhotoModal";

function HomePage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { photos } = useSelector((state) => state);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

  const loadPhotos = async () => {
    try {
      const res = await axios.get("/api/photos", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const { data } = res;

      if (!data?.success) history.push("/login");
      else
        dispatch(actions.setPhotos(data?.data !== undefined ? data.data : []));
    } catch (error) {
      history.push("/login");
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      const res = await axios.delete(`/api/photos/${photoId}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const { data } = res;

      if (!data?.success) {
        console.log(data.errorCode);
        return;
      }
      dispatch(actions.deletePhoto(photoId));
      setSelectedPhotoId(null);
    } catch (error) {
      console.log(error);
      history.push("/login");
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="masonry-layout">
        {photos?.map((photo) => (
          <div key={photo._id} className="photo-container">
            <div className="say-no-to-clean-code" />
            <img src={photo.url} alt={photo.label} />
            {photo.loading === undefined && (
              <>
                <a className="label" href={photo.url} target="__blank">
                  {photo.label}
                </a>
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(true);
                    setSelectedPhotoId(photo._id);
                  }}
                >
                  Delete
                </button>
              </>
            )}
            {photo.loading === true && (
              <div className="loading-container">
                <div className="loading-spiner material-icons">loop</div>
                <p className="loading-status">Deleting...</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <AddPhotoModal
        title="Are you sure?"
        visible={showDeleteConfirmModal}
        onCancel={() => setShowDeleteConfirmModal(false)}
        onConfirm={async () => {
          try {
            const res = await axios.post(
              "/api/accounts/check-password",
              { confirmPassword },
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              }
            );

            if (!res.data.success) {
              setShowDeleteConfirmModal(false);
              return;
            }

            setShowDeleteConfirmModal(false);
            dispatch(actions.setLoading(selectedPhotoId));
            setConfirmPassword("");
            deletePhoto(selectedPhotoId);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <div className="form-control">
          <label>Password</label>
          <input
            name="label"
            placeholder="Enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </AddPhotoModal>
    </div>
  );
}

export default HomePage;
