import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { actions } from "../store";
import { useDispatch, useSelector } from "react-redux";

function HomePage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { photos } = useSelector((state) => state);

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

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        {/* <pre>{JSON.stringify(photos, null, 2)}</pre> */}
        {photos?.map((photo) => (
          <div key={photo._id}>
            <img src={photo.url} alt={photo.label} />
            <p>{photo.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
