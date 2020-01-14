/* tslint:disable */
import React, { useState, useEffect, useRef } from "react";
import StyledFeed from "./Feed.styled";
import Post from "./Post";
import { FeedList } from "./Feed.constants";
import { IPost } from "../../../App.types";

interface IFeedProps {
  data?: IPost[];
  selectedMarker?: number;
  onSelect: (value: number) => void;
}

const Feed = ({ data, onSelect, selectedMarker }: IFeedProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const keyClick = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          selectedIndex === 0 ? FeedList.length - 1 : selectedIndex - 1
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(
          selectedIndex === FeedList.length - 1 ? 0 : selectedIndex + 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelect(selectedIndex);
      }
    };
    window.addEventListener("keydown", keyClick);
    return () => {
      window.removeEventListener("keydown", keyClick);
    };
  });

  return selectedMarker === 0 ? (
    <StyledFeed>
      {data!.map(item => {
        return (
          <Post
            key={item.idPost}
            item={item}
            active={selectedIndex === parseInt(item.idPost)}
            onClick={onSelect}
          />
        );
      })}
    </StyledFeed>
  ) : (
    <StyledFeed>
      {data!
        .filter(selected => parseInt(selected.idPost) === selectedMarker)
        .map(item => {
          return (
            <Post
              key={item.idPost}
              item={item}
              active={selectedIndex === parseInt(item.idPost)}
              onClick={onSelect}
            />
          );
        })}
    </StyledFeed>
  );
};

export default Feed;
