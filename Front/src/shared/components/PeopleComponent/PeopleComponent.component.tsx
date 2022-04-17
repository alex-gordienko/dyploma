/* tslint:disable */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { uniqBy } from "lodash";
import Container from "../Container/Container.Pages.styled";
import StyledPeopleComponent from "./PeopleComponent.styled";
import Label from "./Label";
import PeopleFeed from "./PeopleFeed";
import Filters from "../Filters";
import { IFullDataUser, ISearchedUser } from "../../../App.types";
import { Redirect } from "react-router-dom";
import { sendToSocket } from "../../../backend/httpGet";

interface IPeopleComponentProps {
  socket: SocketIOClient.Socket;
  token: string;
  currentUser: IFullDataUser;
  userNameToSearchFriends?: string;
  contries: { id: number; name_en: string }[];
  cities: { id: number; country_id: number; name_en: string }[];
  onError: (errorMessage: string) => void;
}
const PeopleComponent = ({
  socket,
  token,
  currentUser,
  contries,
  cities,
  onError,
  userNameToSearchFriends
}: IPeopleComponentProps) => {
  var nullPeople: ISearchedUser[] = [];
  var nullFilter = { username: "", country: "", city: "", date: "" };
  const [searchedPeoples, setSearchedPeoples] = useState(nullPeople);
  const [friends, setFriends] = useState(nullPeople);
  const [invites, setInvites] = useState(nullPeople);
  const [blocked, setBlocked] = useState(nullPeople);
  const [filters, setFilters] = useState(nullFilter);
  const [selectedTab, setSelectedTab] = useState(1);
  const [onReadyToCallNextPage, setReadyToCallNextPage] = useState(false);

  socket.on(
    "User Searcher Response",
    (
      res: socket.ISocketResponse<
        ISearchedUser[] | string,
        api.models.IAvailableUserActions
      >
    ) => {
      console.log(res.data.response);

      if (res.data.requestFor === "Search Peoples") {
        if (res.status === "Not Found") {
          if (searchedPeoples.length < 1) setSearchedPeoples([]);
        }
        if (res.status === "SQL Error") {
          onError(res.data.response as string);
        }
        if (res.status === "OK") {
          setSearchedPeoples(prevState =>
            uniqBy(
              [...prevState, ...(res.data.response as ISearchedUser[])],
              "idUsers"
            )
          );
        }
        setReadyToCallNextPage(true);
      }
      if (res.data.requestFor === "Search Friends") {
        if (res.status === "Not Found") {
          if (friends.length < 1) setFriends([]);
        }
        if (res.status === "SQL Error") {
          onError(res.data.response as string);
        }
        if (res.status === "OK") {
          setFriends(prevState =>
            uniqBy(
              [...prevState, ...(res.data.response as ISearchedUser[])],
              "idUsers"
            )
          );
        }
        setReadyToCallNextPage(true);
      }
      if (res.data.requestFor === "Search Invites") {
        if (res.status === "Not Found") {
          if (invites.length < 1) setInvites([]);
        }
        if (res.status === "SQL Error") {
          onError((res.data.response as unknown) as string);
        }
        if (res.status === "OK") {
          setInvites(prevState =>
            uniqBy(
              [...prevState, ...(res.data.response as ISearchedUser[])],
              "idUsers"
            )
          );
        }
        setReadyToCallNextPage(true);
      }
      if (res.data.requestFor === "Search Blocked") {
        if (res.status === "Not Found") {
          if (blocked.length < 1) setBlocked([]);
        }
        if (res.status === "SQL Error") {
          onError((res.data.response as unknown) as string);
        }
        if (res.status === "OK") {
          setBlocked(prevState =>
            uniqBy(
              [...prevState, ...(res.data.response as ISearchedUser[])],
              "idUsers"
            )
          );
        }
        setReadyToCallNextPage(true);
      }
    }
  );

  const searchPeople = useCallback(
    (filter = filters, preloadedPeople = searchedPeoples.length) => {
      sendToSocket<
        api.models.ISearchUserRequest,
        api.models.IAvailableUserActions
      >(socket, {
        operation: "User Searcher Request",
        data: {
          requestFor: "Search Peoples",
          options: {
            currentUser: currentUser.username,
            searchedUser: currentUser.username,
            filters: filter,
            page: preloadedPeople
          }
        },
        token
      });
      setReadyToCallNextPage(false);
    },
    [filters, searchedPeoples.length]
  );

  const searchFriends = (
    username: string,
    filter = filters,
    preloadedPeople = friends.length
  ) => {
    sendToSocket<
      api.models.ISearchUserRequest,
      api.models.IAvailableUserActions
    >(socket, {
      operation: "User Searcher Request",
      data: {
        requestFor: "Search Friends",
        options: {
          currentUser: username,
          searchedUser: currentUser.username,
          filters: filter,
          page: preloadedPeople
        }
      },
      token
    });
  };

  const searchInvites = (
    username: string,
    filter = filters,
    preloadedPeople = invites.length
  ) => {
    sendToSocket<
      api.models.ISearchUserRequest,
      api.models.IAvailableUserActions
    >(socket, {
      operation: "User Searcher Request",
      data: {
        requestFor: "Search Invites",
        options: {
          currentUser: username,
          searchedUser: currentUser.username,
          filters: filter,
          page: preloadedPeople
        }
      },
      token
    });
  };

  const searchBlocked = (
    username: string,
    filter = filters,
    preloadedPeople = blocked.length
  ) => {
    sendToSocket<
      api.models.ISearchUserRequest,
      api.models.IAvailableUserActions
    >(socket, {
      operation: "User Searcher Request",
      data: {
        requestFor: "Search Blocked",
        options: {
          currentUser: username,
          searchedUser: currentUser.username,
          filters: filter,
          page: preloadedPeople
        }
      },
      token
    });
  };

  useEffect(() => {
    setFilters({
      username: "",
      country: "",
      city: "",
      date: ""
    });
    if (selectedTab === 1) {
      searchPeople();
    } else if (selectedTab === 2) {
      searchFriends(
        userNameToSearchFriends ? userNameToSearchFriends : currentUser.username
      );
    } else if (selectedTab === 3) {
      searchInvites(currentUser.username);
    } else if (selectedTab === 4) {
      searchBlocked(currentUser.username);
    }
  }, [selectedTab]);

  const saveFilterProperty = (
    name: "Username" | "Date" | "Country" | "City",
    value: string
  ) => {
    setFilters({
      username: name === "Username" ? value : filters.username,
      country: name === "Country" ? value : filters.country,
      city: name === "City" ? value : filters.city,
      date: name === "Date" ? value : filters.date
    });
    if (selectedTab === 1) {
      searchPeople(
        {
          username: name === "Username" ? value : filters.username,
          country: name === "Country" ? value : filters.country,
          city: name === "City" ? value : filters.city,
          date: name === "Date" ? value : filters.date
        },
        0
      );
    } else if (selectedTab === 2) {
      searchFriends(
        userNameToSearchFriends
          ? userNameToSearchFriends
          : currentUser.username,
        {
          username: name === "Username" ? value : filters.username,
          country: name === "Country" ? value : filters.country,
          city: name === "City" ? value : filters.city,
          date: name === "Date" ? value : filters.date
        },
        0
      );
    } else if (selectedTab === 3) {
      searchInvites(
        currentUser.username,
        {
          username: name === "Username" ? value : filters.username,
          country: name === "Country" ? value : filters.country,
          city: name === "City" ? value : filters.city,
          date: name === "Date" ? value : filters.date
        },
        0
      );
    } else if (selectedTab === 4) {
      searchBlocked(
        currentUser.username,
        {
          username: name === "Username" ? value : filters.username,
          country: name === "Country" ? value : filters.country,
          city: name === "City" ? value : filters.city,
          date: name === "Date" ? value : filters.date
        },
        0
      );
    }
  };

  const onCallNextPage = () => {
    if (selectedTab === 1) {
      searchPeople();
    } else if (selectedTab === 2) {
      searchFriends(
        userNameToSearchFriends ? userNameToSearchFriends : currentUser.username
      );
    } else if (selectedTab === 3) {
      searchInvites(currentUser.username);
    } else if (selectedTab === 4) {
      searchBlocked(currentUser.username);
    }
  };

  const TabSelection = (mode: "search" | "friends" | "blocked" | "invite") => {
    console.log(mode);
    setSelectedTab(
      mode === "search" ? 1 : mode === "friends" ? 2 : mode === "invite" ? 3 : 4
    );
  };

  const onSelect = (userName: string) => {
    return <Redirect to={"/profile/" + userName} />;
  };
  return (
    <Container>
      <Label selectedCaption={selectedTab} onSelect={TabSelection} />
      <StyledPeopleComponent>
        <div style={{ width: "30%" }}>people nearby</div>
        <PeopleFeed
          currentUser={currentUser}
          data={
            selectedTab === 1
              ? searchedPeoples
              : selectedTab === 2
              ? friends
              : selectedTab === 3
              ? invites
              : selectedTab === 4
              ? blocked
              : []
          }
          onSelect={onSelect}
          onReadyToCallNextPage={onReadyToCallNextPage}
          onCallNextPage={onCallNextPage}
        />
        <Filters
          contries={contries}
          cities={cities}
          filters={filters}
          letSearch={saveFilterProperty}
        />
      </StyledPeopleComponent>
    </Container>
  );
};

export default PeopleComponent;
