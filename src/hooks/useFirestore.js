import { useReducer, useEffect, useState } from "react";
import { db } from "../firebase/config";

import {
  addDoc,
  deleteDoc,
  collection,
  doc,
  serverTimestamp,
} from "firebase/firestore";

let initialState = {
  document: null,
  error: null,
  isPending: false,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        document: null,
        error: null,
        isPending: true,
        success: false,
      };
    case "ADDED_DOCUMENT":
      return {
        document: action.payload,
        error: null,
        isPending: false,
        success: true,
      };

    case "UPDATED_DOCUMENT":
      return {
        document: null,
        error: null,
        isPending: false,
        success: true,
      };

    case "DELETED_DOCUMENT":
      return {
        document: null,
        error: null,
        isPending: false,
        success: true,
      };
    case "ERROR":
      return {
        document: null,
        error: true,
        isPending: false,
        success: false,
      };
    default:
      return state;
  }
};

export const useFirestore = (coll) => {
  const [response, dispatch] = useReducer(firestoreReducer, {
    initialState,
  });

  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = collection(db, coll);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (document) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = serverTimestamp();
      const addedDocument = await addDoc(ref, { ...document, createdAt });

      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // Delete a comment
      await deleteDoc(doc(ref, id));

      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { response, addDocument, deleteDocument };
};
