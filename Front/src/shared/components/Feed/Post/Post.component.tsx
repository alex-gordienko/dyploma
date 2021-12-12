/* tslint:disable */
import React, { useCallback, useState } from "react";
import Slider from "react-slick";
import {
  StyledPost,
  Head,
  Label,
  Author,
  Body,
  Photoes,
  Photo,
  Text,
  Time,
  Rating,
  Footer,
  Comments,
  Comment
} from "./Post.styled";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IComment } from "../../../../App.types";
import defaultAvatar from "../../../../assets/img/DefaultPhoto.jpg";
import Input from "../../EditorComponents/Input";
import Preloader from "../../Preloader";
import { NavLink } from "react-router-dom";
import {
  ButtonBlock,
  Delimeter
} from "../../EditorComponents/EditorComponents.styled";
import { ReactComponent as LikeIcon } from "../../../../assets/icons/like.svg";
import { ReactComponent as DislikeIcon } from "../../../../assets/icons/dislike.svg";

interface ILowPostProps {
  type: "Preview";
  item: api.models.IPost;
  isEdit: boolean;
  onClick: (item: number) => void;
  onLike: (post: number, type: "new" | "inversion") => void;
  onDislike: (post: number, type: "new" | "inversion") => void;
}

interface IFullPostProps {
  type: "FullPost";
  item: api.models.IPost;
  comments: IComment[];
  isEdit: boolean;
  onCreateComment: (comment: string) => void;
  onLike: (post: number, type: "new" | "inversion") => void;
  onDislike: (post: number, type: "new" | "inversion") => void;
}

type IPostProps = ILowPostProps | IFullPostProps;
const Post = (mode: IPostProps) => {
  const [comment, setNewComment] = useState("");
  const handleClick = () => {
    if (mode.type === "Preview") mode.onClick(mode.item.idPost);
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 500
  };

  const createComment = () => {
    console.log(comment);
    if (mode.type === "FullPost" && comment != "")
      mode.onCreateComment(comment);
    else alert("Please, Insert Message");
    setNewComment("");
  };

  const setLike = () => {
    if (mode.item.rating.isLikedByMe) {
      mode.onLike(mode.item.idPost, "inversion");
    } else if (mode.item.rating.isDislikedByMe) {
      mode.onLike(mode.item.idPost, "new");
    } else {
      mode.onLike(mode.item.idPost, "new");
    }
  };

  const setDislike = () => {
    if (mode.item.rating.isLikedByMe) {
      mode.onDislike(mode.item.idPost, "new");
    } else if (mode.item.rating.isDislikedByMe) {
      mode.onDislike(mode.item.idPost, "inversion");
    } else {
      mode.onDislike(mode.item.idPost, "new");
    }
  };

  return mode.type === "FullPost" ? (
    <StyledPost key={mode.item.idPost}>
      <Head>
        <div className="leftBlock">
          <Label>{mode.item.Name}</Label>
          <Author>{mode.item.username}</Author>
        </div>
        <div className="rightBlock">
          {mode.isEdit ? (
            <ButtonBlock>
              <NavLink
                className="label-button"
                to={"/postEditor/" + mode.item.idPost}
              >
                Edit
              </NavLink>
            </ButtonBlock>
          ) : null}
        </div>
      </Head>
      <Body>
        <Photoes>
          <Slider {...settings}>
            {mode.item.photoes.map(
              (photoUrl: api.models.IPhotoBuffer, indx: number) => {
                return (
                  <Photo key={indx}>
                    <img src={photoUrl.blob} key={indx} alt="Pic is here" />
                  </Photo>
                );
              }
            )}
          </Slider>
        </Photoes>
        <Rating>
          <div className="content">
            <LikeIcon
              fill={mode.item.rating.isLikedByMe ? "red" : "transparent"}
              width="1.5em"
              height="1.5em"
              onClick={setLike}
            />
            {mode.item.rating.likes}
          </div>
          <div className="content">
            <DislikeIcon
              fill={mode.item.rating.isDislikedByMe ? "red" : "black"}
              style={{ marginLeft: "10px" }}
              width="1.5em"
              height="1.5em"
              onClick={setDislike}
            />
            {mode.item.rating.dislikes}
          </div>
        </Rating>
        <Text>{mode.item.description}</Text>
        <Time>{mode.item.date}</Time>
      </Body>
      <Footer>
        <Comments>
          {
            <Input
              placeholder="Add comment"
              initValue={comment}
              onChanged={setNewComment}
              postpendComponent={
                <ButtonBlock>
                  <div className="label-button" onClick={createComment}>
                    Create
                  </div>
                </ButtonBlock>
              }
            />
          }
          {mode.comments ? (
            mode.comments.length !== 0 ? (
              mode.comments.map((comment: IComment, indx: number) => {
                return (
                  <Comment key={indx} Rating={comment.userRating}>
                    <Delimeter type="horizontal" />
                    <div className="blocks">
                      <div className="left-block">
                        <div className="setRate">+</div>
                        <div className="rating">{comment.rating}</div>
                        <div className="setRate">-</div>
                      </div>
                      <div className="right-block">
                        <img
                          className="avatar"
                          src={
                            comment.userAvatar
                              ? comment.userAvatar
                              : defaultAvatar
                          }
                        />
                        <div className="data">
                          <div className="head">
                            <NavLink
                              className="username"
                              to={"/profile/" + comment.author}
                            >
                              {comment.author}
                            </NavLink>
                            <div className="date">{comment.date}</div>
                          </div>
                          <div className="content">{comment.content}</div>
                        </div>
                      </div>
                    </div>
                  </Comment>
                );
              })
            ) : null
          ) : (
            <Preloader message="Loading comments..." />
          )}
        </Comments>
      </Footer>
      <Delimeter type="horizontal" />
    </StyledPost>
  ) : (
    <StyledPost key={mode.item.idPost}>
      <Head>
        <div className="leftBlock">
          <Label>{mode.item.Name}</Label>
          <Author>{mode.item.username}</Author>
        </div>
        <div className="rightBlock">
          {mode.isEdit ? (
            <ButtonBlock>
              <NavLink
                className="label-button"
                to={"/postEditor/" + mode.item.idPost}
              >
                Edit
              </NavLink>
            </ButtonBlock>
          ) : null}
        </div>
      </Head>
      <Body>
        <Photoes>
          <Slider {...settings}>
            {mode.item.photoes.map(
              (photoUrl: api.models.IPhotoBuffer, indx: number) => {
                return (
                  <Photo key={indx}>
                    <img src={photoUrl.blob} key={indx} alt="Pic is here" />
                  </Photo>
                );
              }
            )}
          </Slider>
        </Photoes>
        <Rating>
          <div className="content">
            <LikeIcon
              fill={mode.item.rating.isLikedByMe ? "red" : "transparent"}
              width="1.5em"
              height="1.5em"
              onClick={setLike}
            />
            {mode.item.rating.likes}
          </div>
          <div className="content">
            <DislikeIcon
              fill={mode.item.rating.isDislikedByMe ? "red" : "black"}
              style={{ marginLeft: "10px" }}
              width="1.5em"
              height="1.5em"
              onClick={setDislike}
            />
            {mode.item.rating.dislikes}
          </div>
        </Rating>
        <Text>{mode.item.description}</Text>
        <Time>{mode.item.date}</Time>
      </Body>
      <Footer>
        <p onClick={handleClick}>Show comments</p>
      </Footer>
      <Delimeter type="horizontal" />
    </StyledPost>
  );
};

Post.defaultProps = {
  active: false
};

export default Post;
