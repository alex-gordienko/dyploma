/* tslint:disable */
import React, { useCallback } from "react";
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
  Footer,
  Comments
} from "./Post.styled";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IPost, IPhotoBuffer } from "../../../../App.types";

interface IPostProps {
  item: IPost;
  active: boolean;
  onClick: (item: number) => void;
}

const Post = ({ item, active, onClick }: IPostProps) => {
  const handleClick = useCallback(() => {
    onClick(parseInt(item.idPost));
    // onClick(item.idPost);
  }, [item.idPost]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 500
  };

  return (
    <StyledPost active={active} onClick={handleClick}>
      <Head>
        <Label>{item.Name}</Label>
        <Author>{item.username}</Author>
      </Head>
      <Body>
        <Photoes>
          <Slider {...settings}>
            {item.photoes.map((photoUrl: IPhotoBuffer, indx: number) => {
              return (
                <Photo>
                  <div key={indx}>
                    <img src={photoUrl.blob} key={indx} alt="Pic is here" />
                    <div>{photoUrl.name}</div>
                  </div>
                </Photo>
              );
            })}
          </Slider>
        </Photoes>
        <Text>{item.comment}</Text>
        <Time>{item.date}</Time>
      </Body>
      <Footer>
        <Comments>
          <p>Comments here</p>
        </Comments>
      </Footer>
    </StyledPost>
  );
};

Post.defaultProps = {
  active: false
};

export default Post;
