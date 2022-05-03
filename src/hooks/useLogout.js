import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { ACTIONS } from "../context/AuthContext";
import { auth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

import { useUserPresence } from "./useUserPresence";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const { setOffline } = useUserPresence();

  const logout = async () => {
    setIsPending(true);
    setError(null);

    try {
      // update online status
      await setOffline(auth.currentUser.uid);

      // sign out user
      await signOut(auth);

      // dispatch login action
      dispatch({ type: ACTIONS.LOGOUT });

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

  return { error, isPending, logout };
};
