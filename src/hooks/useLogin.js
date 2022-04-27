import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { ACTIONS } from "../context/AuthContext";
import { auth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { useFirestore } from "./useFirestore";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const { updateDocument: updateOnlineStatus } = useFirestore("users");

  const login = async (email, password) => {
    setIsPending(true);
    setError(null);

    try {
      // sign in user
      await signInWithEmailAndPassword(auth, email, password);

      // update online status

      await updateOnlineStatus(auth.currentUser.uid, { online: true });

      // dispatch login action
      dispatch({ type: ACTIONS.LOGIN, payload: auth.currentUser });

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

  return { error, isPending, login };
};
