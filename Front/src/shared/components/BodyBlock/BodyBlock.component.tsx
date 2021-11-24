/* tslint:disable */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Container from "../Container/Container.Pages.styled";
import { uniqBy } from "lodash";
import AdaptiveBodyBlock, { Delimeter, Border } from "./BodyBlock.styled";
import PageConstructor from "../../PageConstructor/PageConstructor";

import GoogleMapBlock from "../GoogleMapBlock";
import Feed from "../Feed";
import { IComment, IFullDataUser } from "../../../App.types";
import { sendToSocket } from "../../../backend/httpGet";
import { generateDate } from "../utils/generateData";

const isCommentData = (data: any): data is IComment[] =>
  Object.prototype.toString.call(data) === "[object Array]" &&
  data[0].content !== undefined;

interface IBodyBlockProps {
  mode: "Main Page" | "Profile";
  socket: SocketIOClient.Socket;
  token: string;
  currentUser: IFullDataUser;
  isAnotherUser?: string;
  isPrivatePosts?: boolean;
  onError: (message: string) => void;
}
const BodyBlock = ({
  currentUser,
  mode,
  socket,
  token,
  isAnotherUser,
  isPrivatePosts,
  onError
}: IBodyBlockProps) => {
  var nullFilter = { username: "", country: "", city: "", date: "" };
  const [globalPostsFeed, setGlobalPostsFeed] = useState<api.models.IPost[]>(
    []
  );
  const [userPublicPostFeed, setPublicUserPostFeed] = useState<
    api.models.IPost[]
  >([]);
  const [userPrivatePostFeed, setPrivateUserPostFeed] = useState<
    api.models.IPost[]
  >([]);
  const [onReadyToCallNextPage, setReadyToCallNextPage] = useState(false);

  const [selectedPostID, setSelectedPostID] = useState(0);
  const [comments, setComments] = useState<IComment[]>([]);

  //Ссылка для тела компонента (нужна для рассчётов пропорций окна)
  const bodyBlockRef = useRef<HTMLDivElement>(null);

  //Обработчик для работы с постами
  socket.on(
    "Get Posts Response",
    (
      res: socket.ISocketResponse<
        api.models.IPost[],
        api.models.IAvailablePostActions
      >
    ) => {
      if (res.data.requestFor === "get all posts") {
        if (res.status === "Server Error" || res.status === "SQL Error") {
          onError(
            `Connection error. Please, reload page. Stack: \n${res.data.response}`
          );
        }
        if (res.data.response && res.status === "OK") {
          setGlobalPostsFeed(prevState =>
            uniqBy([...prevState, ...res.data.response], "idPost")
          );
        }
        socket.removeEventListener("Get Posts Response");
        setReadyToCallNextPage(true);
      }

      if (res.data.requestFor === "get user public posts") {
        if (res.status === "Server Error" || res.status === "SQL Error") {
          onError(
            `Connection error. Please, reload page. Stack: \n${res.data.response}`
          );
        }
        if (res.status === "Not Found") {
          if (
            userPublicPostFeed.length > 1 &&
            userPublicPostFeed[0].username !== isAnotherUser
          ) {
            setPublicUserPostFeed([]);
          }
        }
        if (res.data.response && res.status === "OK") {
          setPublicUserPostFeed(prevState =>
            uniqBy([...prevState, ...res.data.response], "idPost")
          );
        }
        socket.removeEventListener("Get Posts Response");
        setReadyToCallNextPage(true);
      }

      if (res.data.requestFor === "get user private posts") {
        if (res.status === "Server Error" || res.status === "SQL Error") {
          onError(
            `Connection error. Please, reload page. Stack: \n${res.data.response}`
          );
        }
        if (res.data.response && res.status === "OK") {
          setPrivateUserPostFeed(prevState =>
            uniqBy([...prevState, ...res.data.response], "idPost")
          );
        }
        socket.removeEventListener("Get Posts Response");
        setReadyToCallNextPage(true);
      }
    }
  );

  socket.on(
    "Comments Response",
    (
      res: socket.ISocketResponse<IComment[], api.models.IAvailablePostActions>
    ) => {
      //Если это ответ на запрос о получении комментариев к посту
      if (res.data.requestFor === "get comments") {
        if (res.status === "OK") {
          console.log(res);
          setComments((res.data.response as unknown) as IComment[]);
        } else if (
          res.status === "Server Error" ||
          res.status === "SQL Error"
        ) {
          console.error(`Rejected: ${res.data.response}`);
          onError(
            `Connection error. Please, reload page. Stack: \n${JSON.stringify(
              res.data.response
            )}`
          );
        }
      }
      //Если это ответ на запрос о создании комментария
      if (res.data.requestFor === "create comment") {
        if (res.status === "OK") {
          console.log(res);
        } else if (
          res.status === "Server Error" ||
          res.status === "SQL Error"
        ) {
          console.error(`Rejected: ${res.data.response}`);
          onError(
            `Connection error. Please, reload page. Stack: \n${JSON.stringify(
              res.data.response
            )}`
          );
        }
      }
    }
  );

  socket.on(
    "Rating Response",
    (
      res: socket.ISocketResponse<
        api.models.IPost,
        api.models.IAvailableRatingActions
      >
    ) => {
      if (res.data.requestFor === "set post rating") {
        if (res.status === "OK") {
          if (isAnotherUser) {
            setPublicUserPostFeed(prevState => {
              return prevState.map(post => {
                let updatedPost = post;
                if (post.idPost === res.data.response.idPost)
                  updatedPost.rating = res.data.response.rating;
                return updatedPost;
              });
            });
          } else {
            setGlobalPostsFeed(prevState => {
              return prevState.map(post => {
                let updatedPost = post;
                if (post.idPost === res.data.response.idPost)
                  updatedPost.rating = res.data.response.rating;
                return updatedPost;
              });
            });
          }
        }
      } else {
        onError(
          `Connection error. Please, reload page. Stack: \n${JSON.stringify(
            res.data.response
          )}`
        );
      }
    }
  );

  const loadMorePosts = (
    postIDs = Array.from(globalPostsFeed, post => post.idPost)
  ) => {
    let postType = isPrivatePosts
      ? ("get user private posts" as "get user private posts")
      : ("get user public posts" as "get user public posts");

    sendToSocket<api.models.IGetPostsRequest, api.models.IAvailablePostActions>(
      socket,
      {
        data: {
          options: {
            username: isAnotherUser || currentUser.username,
            currentUser: currentUser.idUsers,
            filters: nullFilter,
            postIDs: postIDs
          },
          requestFor: isAnotherUser ? postType : "get all posts"
        },
        operation: "Get Posts Request",
        token
      }
    );
    setReadyToCallNextPage(false);
  };

  const loadComments = (postID: number) => {
    if (postID !== 0) {
      sendToSocket<
        api.models.IGetPostsRequest,
        api.models.IAvailablePostActions
      >(socket, {
        data: {
          options: {
            username: isAnotherUser || currentUser.username,
            currentUser: currentUser.idUsers,
            filters: nullFilter,
            postIDs: [postID]
          },
          requestFor: "get comments"
        },
        operation: "Comments Request",
        token
      });
    }
  };

  const onCreateComment = (idPost: number, comment: string) => {
    const prevPostState =
      mode === "Main Page"
        ? globalPostsFeed.filter(post => post.idPost === idPost)
        : userPublicPostFeed.filter(post => post.idPost === idPost);
    const newComment: IComment = {
      content: comment,
      date: generateDate(),
      author: currentUser.username,
      rating: 0,
      userAvatar: currentUser.avatar,
      userRating: currentUser.rating
    };
    //console.log(" Current post: ", prevPostState);
    console.log("Creating new comment: ", newComment);
    setComments(prevState => [...prevState, newComment]);

    sendToSocket<
      api.models.ICreateCommentRequest,
      api.models.IAvailablePostActions
    >(socket, {
      data: {
        options: {
          idUser: currentUser.idUsers,
          content: newComment.content,
          rating: newComment.rating!,
          date: newComment.date,
          idPost: prevPostState[0].idPost
        },
        requestFor: "create comment"
      },
      operation: "Comments Request",
      token
    });
  };

  useEffect(() => {
    if (!isAnotherUser && globalPostsFeed.length < 1) {
      console.log("Preloading all posts");
      loadMorePosts([]);
    } else if (isAnotherUser && userPublicPostFeed.length < 1) {
      console.log("Preloading users public posts");
      loadMorePosts([]);
    } else if (isAnotherUser && userPrivatePostFeed.length < 1) {
      console.log("Preloading users private posts");
      loadMorePosts([]);
    }
  }, [globalPostsFeed, isAnotherUser, isPrivatePosts]);

  const onSetLike = (
    post: number,
    type: "new" | "inversion" | "from dislike"
  ) => {
    sendToSocket<
      api.models.ISetPostRatingRequest,
      api.models.IAvailableRatingActions
    >(socket, {
      data: {
        options: {
          idUser: currentUser.idUsers,
          idPost: post,
          setting: "like",
          type
        },
        requestFor: "set post rating"
      },
      operation: "Rating Request",
      token
    });
  };

  const onSetDislike = (
    post: number,
    type: "new" | "inversion" | "from like"
  ) => {
    sendToSocket<
      api.models.ISetPostRatingRequest,
      api.models.IAvailableRatingActions
    >(socket, {
      data: {
        options: {
          idUser: currentUser.idUsers,
          idPost: post,
          setting: "dislike",
          type
        },
        requestFor: "set post rating"
      },
      operation: "Rating Request",
      token
    });
  };

  var pageSize = bodyBlockRef.current
    ? bodyBlockRef.current.offsetWidth
    : document.body.clientWidth;
  var minX = pageSize * 0.29;

  const selectedMarker = (e: number) => {
    setSelectedPostID(e);
    loadComments(e);
  };
  return (
    <AdaptiveBodyBlock ref={bodyBlockRef} mode={mode}>
      <PageConstructor initSizes={[minX, pageSize - minX]}>
        {selectedPostID === 0 ? (
          <Feed
            type="Preview"
            currentUser={currentUser.idUsers}
            onReadyToCallNextPage={onReadyToCallNextPage}
            data={
              isAnotherUser
                ? isPrivatePosts
                  ? userPrivatePostFeed
                  : userPublicPostFeed
                : globalPostsFeed
            }
            onSelect={selectedMarker}
            onCallNextPage={loadMorePosts}
            onLike={onSetLike}
            onDislike={onSetDislike}
          />
        ) : (
          <Feed
            type="FullPost"
            currentUser={currentUser.idUsers}
            data={
              isAnotherUser
                ? isPrivatePosts
                  ? userPrivatePostFeed.find(e => e.idPost === selectedPostID)
                  : userPublicPostFeed.find(e => e.idPost === selectedPostID)
                : globalPostsFeed.find(e => e.idPost === selectedPostID)
            }
            comments={comments}
            onSelect={selectedMarker}
            onCreateComment={onCreateComment}
            onLike={onSetLike}
            onDislike={onSetDislike}
          />
        )}
        <GoogleMapBlock
          mode="Posts"
          data={
            selectedPostID === 0
              ? isAnotherUser
                ? isPrivatePosts
                  ? userPrivatePostFeed
                  : userPublicPostFeed
                : globalPostsFeed
              : isAnotherUser
              ? isPrivatePosts
                ? userPrivatePostFeed.filter(e => e.idPost === selectedPostID)
                : userPublicPostFeed.filter(e => e.idPost === selectedPostID)
              : globalPostsFeed.filter(e => e.idPost === selectedPostID)
          }
          selectedMarker={selectedMarker}
        />
      </PageConstructor>
    </AdaptiveBodyBlock>
  );
};

export default BodyBlock;
