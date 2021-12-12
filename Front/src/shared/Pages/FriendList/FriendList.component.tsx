import React, { FC } from "react";
import { Redirect } from "react-router";
import { useParams } from "react-router-dom";
import { IFullDataUser } from "../../../App.types";
import PeopleComponent from "../../components/PeopleComponent";
import Preloader from "../../components/Preloader";

interface IFriendListPageProps {
  socket: SocketIOClient.Socket;
  country_city: api.models.ICountriesAndCities;
  isReady: boolean;
  isLogin: boolean;
  token: string;
  currentUser: IFullDataUser;
  progressMessage: string;
  onError: (message: string) => void;
}

const FriendListComponent: FC<IFriendListPageProps> = ({
  socket,
  token,
  country_city,
  currentUser,
  isLogin,
  isReady,
  progressMessage,
  onError
}) => {
  const { username } = useParams<{ username: string }>();
  return isReady && country_city ? (
    isLogin ? (
      <PeopleComponent
        socket={socket}
        token={token}
        currentUser={currentUser}
        userNameToSearchFriends={username}
        contries={country_city.country}
        cities={country_city.city}
        onError={onError}
      />
    ) : (
      <Redirect to={"/login"} />
    )
  ) : (
    <Preloader message={progressMessage} />
  );
};

export default FriendListComponent;
