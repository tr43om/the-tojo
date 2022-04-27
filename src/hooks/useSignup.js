import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { ACTIONS } from "../context/AuthContext";
import { auth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { useFirestore } from "./useFirestore";
import { storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { addDocument: addUserDocument } = useFirestore("users");
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setIsPending(true);
    setError(null);

    try {
      // sign up user
      await createUserWithEmailAndPassword(auth, email, password);

      // upload user thumbnail
      const uploadPath = `thumbnails/${auth.currentUser.uid}/${thumbnail.name}`;

      const storagePath = ref(storage, uploadPath);

      const img = await uploadBytes(storagePath, thumbnail);
      const imgUrl = await getDownloadURL(img.ref);

      // add display name to user
      await updateProfile(auth.currentUser, { displayName, photoURL: imgUrl });

      // create a user document
      await addUserDocument(
        {
          online: true,
          photoURL: imgUrl,
          displayName,
        },
        auth.currentUser.uid
      );

      // dispatch login action
      dispatch({ type: ACTIONS.LOGIN, payload: auth.currentUser });

      // If component is NOT unmounted, update states
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setIsPending(false);
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
