import React from "react";
import { type RouterOutputs } from "@/trpc/react";

interface UserContextProps {
  id: string;
  update: () => void;
  user?: RouterOutputs["user"]["getUser"];
  friendRequest?: RouterOutputs["user"]["getFriendRequest"];
}

const UserContext = React.createContext<UserContextProps | null>(null);

interface UserProviderProps extends UserContextProps {
  children: React.ReactNode;
}

export const UserProvider = ({
  children,
  id,
  friendRequest,
  user,
  update,
}: UserProviderProps) => {
  // const { data: user } = api.user.getUser.useQuery({ id });
  // const { data: friendRequest } = api.user.getFriendRequest.useQuery({
  //   userIdTo: id,
  // });
  return (
    <UserContext.Provider
      value={{
        update,
        id,
        user,
        friendRequest,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
