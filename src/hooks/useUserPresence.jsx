import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  set,
} from "firebase/database";
import { auth } from "../firebase/config";
import { useEffect } from "react";
import { useState } from "react";

export const useUserPresence = () => {
  const realtimeDB = getDatabase();
  const usersRef = ref(realtimeDB, "/users");
  const [onlineUsers, setOnlineUsers] = useState();

  document.addEventListener("visibilitychange", () => {
    const userId = auth?.currentUser?.uid;
    const reference = ref(realtimeDB, `/users/${userId}`);

    (async () => {
      if (document.visibilityState !== "visible") {
        await set(reference, "away");
      } else {
        await set(reference, "online");
      }
    })();
  });

  useEffect(() => {
    onValue(ref(realtimeDB, ".info/connected"), (snap) => {
      if (snap.val() === true) {
        (async () => {
          const userId = auth?.currentUser?.uid;
          const reference = ref(realtimeDB, `/users/${userId}`);
          await set(reference, "online");
        })();
      }
    });

    onValue(usersRef, (snap) => {
      const snapshot = snap.val();
      if (snap.exists()) {
        setOnlineUsers(Object.entries(snapshot));

        (async () => {
          if (auth?.currentUser?.uid) {
            const userId = auth.currentUser.uid;
            const reference = ref(realtimeDB, `/users/${userId}`);

            await onDisconnect(reference).remove();
          }
        })();
      }
    });
  }, []);

  const isOnline = (uid) => {
    if (onlineUsers) {
      if (onlineUsers.some((user) => user[0] === uid && user[1] === "online"))
        return "online";
      if (onlineUsers.some((user) => user[0] === uid && user[1] === "away"))
        return "away";
    }
  };

  const setOnline = async (uid) => {
    await set(ref(realtimeDB, `/users/${uid}`), "online");

    return;
  };

  const setOffline = async (uid) => {
    await set(ref(realtimeDB, `/users/${uid}`), "offline");

    return;
  };

  return { setOnline, setOffline, isOnline, onlineUsers };
};
