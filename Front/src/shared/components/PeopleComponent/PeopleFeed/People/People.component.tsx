/* tslint:disable */
import React, { useCallback, useState } from "react";
import Slider from "react-slick";
import {
  StyledPeople,
  LeftBlock,
  CenterBlock,
  RightBlock,
  Avatar,
  Label,
  Body,
  Online,
  Footer
} from "./People.styled";
import { ISearchedUser } from "../../../../../App.types";
import defaultAvatar from "../../../../../assets/img/DefaultPhoto.jpg";
import Input from "../../../EditorComponents/Input";
import { Redirect, NavLink } from "react-router-dom";
import { ButtonBlock } from "../../../EditorComponents/EditorComponents.styled";

interface IPeopleProps {
  item: ISearchedUser;
  onClick: (item: string) => void;
}

const People = ({ item, onClick }: IPeopleProps) => {
  const [comment, setNewComment] = useState("");
  const handleClick = () => {
    return <Redirect to={"/profile/" + item.username} />;
  };

  const getAge = (dob: string) => {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var birth = new Date(dob);
    var dobInThisYear = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    var Age, title;

    Age = today.getFullYear() - birth.getFullYear();
    if (today < dobInThisYear) Age -= 1;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Nov",
      "Dec"
    ];
    title =
      birth.getDate() +
      " " +
      months[birth.getMonth()] +
      " " +
      birth.getFullYear();
    return <div title={title}>{Age} years</div>;
  };

  return (
    <StyledPeople
      title={
        item.isBanned
          ? "This user is banned"
          : !item.isConfirm
          ? "This user still not confirm his/her account"
          : undefined
      }
      status={item.isBanned ? "banned" : !item.isConfirm ? "nonValid" : ""}
      key={item.idUsers}
      onClick={handleClick}
    >
      <LeftBlock>
        <Avatar>
          {item.avatar ? (
            <img src={item.avatar} key={item.idUsers} alt="Pic is here" />
          ) : (
            <img src={defaultAvatar} key={item.idUsers} alt="Pic is here" />
          )}
        </Avatar>
      </LeftBlock>
      <CenterBlock>
        <Label Rating={item.rating}>
          <NavLink className="username" to={"/profile/" + item.username}>
            {item.username}
          </NavLink>
        </Label>
        <Online>
          {item.isOnline ? "Online" : "Last online: " + item.lastOnline}
        </Online>
        <Body>
          {item.FirstName} {item.Country !== "" ? item.Country : null}{" "}
          {item.City !== "" ? item.City : null}{" "}
          {item.Birthday ? getAge(item.Birthday) : null}
        </Body>
      </CenterBlock>
      <RightBlock></RightBlock>
    </StyledPeople>
  );
};

export default People;
