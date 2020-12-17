import { createStore } from "redux";

const SET_PHOTOS = "SET_PHOTOS";
const ADD_PHOTO = "ADD_PHOTO";
const DELETE_PHOTO = "DELETE_PHOTO";
const SET_SEARCH_STRING = "SET_SEARCH_STRING";
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
const setSearchString = (searchString) => {
  return { type: SET_SEARCH_STRING, payload: { searchString } };
};

export const actions = {
  setPhotos,
  addPhoto,
  deletePhoto,
  setLoading,
  setSearchString,
};

const reducer = (state = { photos: [], searchString: "" }, action) => {
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
      state = { ...state, photos: [photo, ...state.photos] };
      return state;
    }

    case DELETE_PHOTO: {
      const { photoId } = payload;
      const photoIndex = state.photos.findIndex(
        (photo) => photo._id === photoId
      );

      state = {
        ...state,
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
        ...state,
        photos: [
          ...state.photos.slice(0, photoIndex),
          { ...state.photos[photoIndex], loading: true },
          ...state.photos.slice(photoIndex + 1),
        ],
      };

      return state;
    }

    case SET_SEARCH_STRING: {
      const { searchString } = payload;

      state = { ...state, searchString };
      console.log(searchString);

      return state;
    }

    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
