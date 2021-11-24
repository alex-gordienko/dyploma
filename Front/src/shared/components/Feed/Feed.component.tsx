/* tslint:disable */
import React, { useState, useEffect, useRef, useCallback } from "react";
import StyledFeed from "./Feed.styled";
import Post from "./Post";
import Preloader from "../Preloader";
import { FeedList } from "./Feed.constants";
import { IComment } from "../../../App.types";
import { ButtonBlock } from "../EditorComponents/EditorComponents.styled";

interface ILowFeedProps {
  type: "Preview";
  data: api.models.IPost[];
  currentUser: number;
  onReadyToCallNextPage: boolean;
  onSelect: (value: number) => void;
  onCallNextPage: (postsCount: number[]) => void;
  onLike: (post: number, type: "new" | "inversion" | "from dislike") => void;
  onDislike: (post: number, type: "new" | "inversion" | "from like") => void;
}

interface IFullFeedProps {
  type: "FullPost";
  data?: api.models.IPost;
  comments: IComment[];
  currentUser: number;
  onSelect: (value: number) => void;
  onCreateComment: (idPost: number, comment: string) => void;
  onLike: (post: number, type: "new" | "inversion" | "from dislike") => void;
  onDislike: (post: number, type: "new" | "inversion" | "from like") => void;
}

type IFeedProps = ILowFeedProps | IFullFeedProps;
const Feed = (mode: IFeedProps) => {
  const lastPostElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log("Auto call next page");
        if (mode.type === "Preview" && mode.data.length > 1) {
          mode.onCallNextPage(Array.from(mode.data, post => post.idPost));
        }
      }
    });
    if (lastPostElement.current) {
      observer.observe(lastPostElement.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [mode.data]);

  const loadMore = () => {
    if (mode.type === "Preview") {
      mode.onCallNextPage(Array.from(mode.data, post => post.idPost));
    }
  };

  return mode.type === "Preview" ? (
    <StyledFeed>
      {mode.data ? (
        mode.data.map((item, indx) => {
          return (
            <Post
              key={indx}
              type="Preview"
              item={item}
              isEdit={mode.currentUser === item.idUser ? true : false}
              onClick={mode.onSelect}
              onLike={mode.onLike}
              onDislike={mode.onDislike}
            />
          );
        })
      ) : (
        <Preloader message="Loading posts..." />
      )}
      {mode.onReadyToCallNextPage ? (
        <ButtonBlock>
          <div
            ref={lastPostElement}
            onClick={loadMore}
            className="label-button"
          >
            Load More
          </div>
        </ButtonBlock>
      ) : (
        <Preloader message="Loading posts..." />
      )}
    </StyledFeed>
  ) : (
    <StyledFeed>
      {mode.data ? (
        <Post
          type="FullPost"
          item={mode.data}
          isEdit={mode.currentUser === mode.data.idUser ? true : false}
          comments={mode.comments}
          onCreateComment={(comment: string) => {
            mode.onCreateComment(mode.data!.idPost, comment);
          }}
          onLike={mode.onLike}
          onDislike={mode.onDislike}
        />
      ) : (
        <Preloader message="Loading posts..." />
      )}
    </StyledFeed>
  );
};

export default Feed;
