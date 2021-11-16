/* tslint:disable */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Container from "../Container/Container.Pages.styled";
import AdaptiveBodyBlock, { Delimeter, Border } from "./BodyBlock.styled";
import PageConstructor from "../../PageConstructor/PageConstructor";

import GoogleMapBlock from "../GoogleMapBlock";
import Feed from "../Feed";
import { IPost, IComment, IFullDataUser } from "../../../App.types";
import { sendToSocket } from "../../../backend/httpGet";

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
  var nullFilter = { username: "", country: "", city: "", date: new Date() };
  const [globalPostsFeed, setGlobalPostsFeed] = useState<IPost[]>([]);
  const [userPublicPostFeed, setPublicUserPostFeed] = useState<IPost[]>([]);
  const [userPrivatePostFeed, setPrivateUserPostFeed] = useState<IPost[]>([]);
  const [onReadyToCallNextPage, setReadyToCallNextPage] = useState(false);

  const [selectedPostID, setSelectedPostID] = useState(0);
  const [comments, setComments] = useState<IComment[]>([]);

  //Ссылка для таймера (нужен для создания асинхронности)
  const timeHandler = useRef<any>();

  //Ссылка для тела компонента (нужна для рассчётов пропорций окна)
  const bodyBlockRef = useRef<HTMLDivElement>(null);

  //Обработчик для работы с постами
  socket.on("Get Posts Response", (res: socket.ISocketResponse<IPost[]>) => {
    //При каждом срабатывании EventListener...
    //Обнуляем таймер
    clearTimeout(timeHandler.current);

    //Проверяем, что это за операция к нам поступила в ответе
    //Если это ответ на запрос о получении постов
    if (res.data.requestFor === "get all posts") {
      //Если ошибка сервера Node или сервера БД - дропаем страницу ошибки
      if (res.status === "Server Error" || res.status === "SQL Error") {
        console.error(`Rejected: ${res.data.response}`);
        onError(
          `Connection error. Please, reload page. Stack: \n${JSON.stringify(
            res.data.response
          )}`
        );
      }
      //Если все хорошо
      else if (res.data.response && res.status === "OK") {
        //Поштучно получаем каждый пост и добавляем его в Сет
        let newGlobalPosts = Array.from(
          new Set(globalPostsFeed.concat(res.data.response))
        );
        //С помощью таймера асинхронно обновляем массив постов
        timeHandler.current = setTimeout(() => {
          console.log(newGlobalPosts);
          setGlobalPostsFeed(newGlobalPosts);
        }, 1);
        setReadyToCallNextPage(true);
      }
    }

    if (res.data.requestFor === "get user public posts") {
      //Если ошибка сервера Node или сервера БД - дропаем страницу ошибки
      if (res.status === "Server Error" || res.status === "SQL Error") {
        console.error(`Rejected: ${res.data.response}`);
        onError(
          `Connection error. Please, reload page. Stack: \n${JSON.stringify(
            res.data.response
          )}`
        );
      }
      //Если все хорошо
      else if (res.data.response && res.status === "OK") {
        //Поштучно получаем каждый пост и добавляем его в Сет
        let newUserPublicPosts = Array.from(
          new Set(userPublicPostFeed.concat(res.data.response))
        );
        //С помощью таймера асинхронно обновляем массив постов
        timeHandler.current = setTimeout(() => {
          console.log(newUserPublicPosts);
          setPublicUserPostFeed(newUserPublicPosts);
        }, 1);
        setReadyToCallNextPage(true);
      }
    }

    if (res.data.requestFor === "get user private posts") {
      //Если ошибка сервера Node или сервера БД - дропаем страницу ошибки
      if (res.status === "Server Error" || res.status === "SQL Error") {
        console.error(`Rejected: ${res.data.response}`);
        onError(
          `Connection error. Please, reload page. Stack: \n${JSON.stringify(
            res.data.response
          )}`
        );
      }
      //Если все хорошо
      else if (res.data.response && res.status === "OK") {
        //Поштучно получаем каждый пост и добавляем его в Сет
        let newUserPrivatePosts = Array.from(
          new Set(userPrivatePostFeed.concat(res.data.response))
        );
        //С помощью таймера асинхронно обновляем массив постов
        timeHandler.current = setTimeout(() => {
          console.log(newUserPrivatePosts);
          setPrivateUserPostFeed(newUserPrivatePosts);
        }, 1);
        setReadyToCallNextPage(true);
      }
    }

    //Если это ответ на запрос о получении комментариев к посту
    if (res.data.requestFor === "get comments") {
      if (isCommentData(res.data.response) && res.status === "OK") {
        //Таймером устанавливаем список комментариев
        timeHandler.current = setTimeout(() => {
          console.log(res);
          setComments((res.data.response as unknown) as IComment[]);
        }, 1);
      } else if (res.status === "Server Error" || res.status === "SQL Error") {
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
      } else if (res.status === "Server Error" || res.status === "SQL Error") {
        console.error(`Rejected: ${res.data.response}`);
        onError(
          `Connection error. Please, reload page. Stack: \n${JSON.stringify(
            res.data.response
          )}`
        );
      }
    }
  });

  socket.on("Get User Public Posts Response", (res: any) => {
    if (res.result === "No Results Found.") {
      if (userPublicPostFeed.length > 1)
        if (userPublicPostFeed[0].username !== isAnotherUser)
          setPublicUserPostFeed([]);
    } else {
      let newFeed = userPublicPostFeed.concat(res.result);
      setPublicUserPostFeed(newFeed);
    }
  });

  socket.on("Set Rating Response", (res: any) => {
    if (isAnotherUser) {
      setPublicUserPostFeed(prevState => {
        return prevState.map(post => {
          let updatedPost = post;
          if (post.idPost === res.result.IdPost)
            updatedPost.rating = res.result.rating;
          return updatedPost;
        });
      });
    } else {
      setGlobalPostsFeed(prevState => {
        return prevState.map(post => {
          let updatedPost = post;
          if (post.idPost === res.result.IdPost)
            updatedPost.rating = res.result.rating;
          return updatedPost;
        });
      });
    }
  });

  //(error) => {}

  const loadMorePosts = (
    postIDs = Array.from(globalPostsFeed, post => post.idPost)
  ) => {
    let postType = isPrivatePosts
      ? "get user private posts"
      : "get user public posts";

    sendToSocket<api.models.IGetPostsRequest>(socket, {
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
    });
    setReadyToCallNextPage(false);
  };

  const loadComments = (postID: number) => {
    if (postID !== 0) {
      sendToSocket<api.models.IGetPostsRequest>(socket, {
        data: {
          options: {
            username: isAnotherUser || currentUser.username,
            currentUser: currentUser.idUsers,
            filters: nullFilter,
            postIDs: [postID]
          },
          requestFor: "get comments"
        },
        operation: "Get Posts Request",
        token
      });
    }
  };

  const onCreateComment = (idPost: number, comment: string) => {
    var d = new Date();
    var dateTime: string =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getDate() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds();
    const prevPostState =
      mode === "Main Page"
        ? globalPostsFeed.filter(post => post.idPost === idPost)
        : userPublicPostFeed.filter(post => post.idPost === idPost);
    const newComment: IComment = {
      content: comment,
      date: dateTime,
      author: currentUser.username,
      rating: 0,
      userAvatar: currentUser.avatar,
      userRating: currentUser.rating
    };
    //console.log(" Current post: ", prevPostState);
    console.log("Creating new comment: ", newComment);
    setComments(prevState => [...prevState, newComment]);

    sendToSocket<api.models.ICreateCommentAction>(socket, {
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
      operation: "Get Posts Request",
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
    const postData =
      '{ "operation": "set rating"' +
      ', "json": {' +
      ' "idUser": ' +
      currentUser.idUsers +
      ', "data": ' +
      '{ "idPost": ' +
      post +
      ', "setting": "like"' +
      ', "type":"' +
      type +
      '"}' +
      "}}";
    // sendData("createpost.php", postData);
  };

  const onSetDislike = (
    post: number,
    type: "new" | "inversion" | "from like"
  ) => {
    const postData =
      '{ "operation": "set rating"' +
      ', "json": {' +
      ' "idUser": ' +
      currentUser.idUsers +
      ', "data": ' +
      '{ "idPost": ' +
      post +
      ', "setting": "dislike"' +
      ', "type":"' +
      type +
      '"}' +
      "}}";
    // sendData("createpost.php", postData);
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
