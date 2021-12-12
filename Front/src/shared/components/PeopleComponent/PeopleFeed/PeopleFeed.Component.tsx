/* tslint:disable */
import React, { useState, useEffect, useRef } from "react";
import StyledFeed from "./PeopleFeed.styled";
import {
  Delimeter,
  ButtonBlock
} from "../../EditorComponents/EditorComponents.styled";
import People from "./People";
import { ISearchedUser, IFullDataUser } from "../../../../App.types";

interface IFeedProps {
  data: ISearchedUser[];
  currentUser: IFullDataUser;
  onSelect: (value: string) => void;
  onReadyToCallNextPage: boolean;
  onCallNextPage: () => void;
}

const PeopleFeed = ({
  data,
  currentUser,
  onSelect,
  onReadyToCallNextPage,
  onCallNextPage
}: IFeedProps) => {
  const lastPostElement = useRef<HTMLDivElement>(null);
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      console.log("Visible");
      if (data.length > 1) onCallNextPage();
    }
  });

  useEffect(() => {
    if (onReadyToCallNextPage && lastPostElement.current) {
      observer.observe(lastPostElement.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [data.length]);

  const loadMore = () => {
    onCallNextPage();
  };

  return data !== [] ? (
    <StyledFeed>
      {data.map((item, indx) => {
        return (
          <div key={indx}>
            <People key={item.idUsers} item={item} onClick={onSelect} />
            <Delimeter type="horizontal" />
          </div>
        );
      })}
      {onReadyToCallNextPage ? (
        <ButtonBlock>
          <div
            ref={lastPostElement}
            onClick={loadMore}
            className="label-button"
          >
            Load More
          </div>
        </ButtonBlock>
      ) : null}
    </StyledFeed>
  ) : (
    <StyledFeed>No Results Found, dude</StyledFeed>
  );
};

export default PeopleFeed;
