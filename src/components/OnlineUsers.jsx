import { useCollection } from "../hooks/useCollection";

// components
import { Avatar } from "./Avatar";
// styles
import "./OnlineUsers.scss";

import { useUserPresence } from "../hooks/useUserPresence";

export const OnlineUsers = () => {
  const { error, documents } = useCollection("users");

  const { isOnline } = useUserPresence();

  return (
    <div className="user-list">
      <h2>All users</h2>
      {error && <div className="error">{error}</div>}
      {documents &&
        documents.map((user) => (
          <div key={user.id} className="user-list-item">
            {isOnline(user.id) === "online" && (
              <span className="online-user"></span>
            )}
            {isOnline(user.id) === "away" && (
              <span className="away-user"></span>
            )}
            <span>{user.displayName}</span>
            <Avatar src={user.photoURL} />
          </div>
        ))}
    </div>
  );
};
