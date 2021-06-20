/* tslint:disable */
import React, { useRef, useState, useCallback, useEffect } from "react";
import { StyledUserFriendsBlock, Friend } from "./UserFriends.styled";
import defaultAvatar from "../../../../assets/img/DefaultPhoto.jpg";
import { NavLink } from "react-router-dom";

interface IUserFriendsProps {
  friends: { username: string; avatar: string }[];
}

const UserFriends = ({ friends }: IUserFriendsProps) => {
  return (
    <StyledUserFriendsBlock>
      {friends ? (
        friends.map(friend => {
          return (
            <Friend>
              {friend.avatar ? (
                <img className="avatar" src={friend.avatar} />
              ) : (
                <img className="avatar" src={defaultAvatar} />
              )}
              <NavLink className="username" to={"/profile/" + friend.username}>
                {friend.username}
              </NavLink>
            </Friend>
          );
        })
      ) : (
        <div></div>
      )}
    </StyledUserFriendsBlock>
  );
};

export default UserFriends;
