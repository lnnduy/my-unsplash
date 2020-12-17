import { createStore } from "redux";

const SET_PHOTOS = "SET_PHOTOS";
const ADD_PHOTO = "ADD_PHOTO";
const DELETE_PHOTO = "DELETE_PHOTO";
const SET_STATUS = "SET_STATUS";

const setPhotos = (photos) => {
  return { type: SET_PHOTOS, payload: { photos } };
};

const addPhoto = (photo) => {
  return { type: ADD_PHOTO, payload: { photo } };
};

const deletePhoto = (photoId) => {
  return { type: DELETE_PHOTO, payload: { photoId } };
};

const setLoading = (photoId) => {
  return { type: SET_STATUS, payload: { photoId } };
};

export const actions = {
  setPhotos,
  addPhoto,
  deletePhoto,
  setLoading,
};

const reducer = (state = { photos: [] }, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PHOTOS: {
      const { photos } = payload;
      state = { ...state, photos: [...photos] };
      console.log(state);
      return state;
    }

    case ADD_PHOTO: {
      const { photo } = payload;
      state = { photos: [photo, ...state.photos] };
      return state;
    }

    case DELETE_PHOTO: {
      const { photoId } = payload;
      const photoIndex = state.photos.findIndex(
        (photo) => photo._id === photoId
      );

      state = {
        photos: [
          ...state.photos.slice(0, photoIndex),
          ...state.photos.slice(photoIndex + 1),
        ],
      };

      return state;
    }

    case SET_STATUS: {
      const { photoId } = payload;
      const photoIndex = state.photos.findIndex(
        (photo) => photo._id === photoId
      );

      state = {
        photos: [
          ...state.photos.slice(0, photoIndex),
          { ...state.photos[photoIndex], loading: true },
          ...state.photos.slice(photoIndex + 1),
        ],
      };

      return state;
    }
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
