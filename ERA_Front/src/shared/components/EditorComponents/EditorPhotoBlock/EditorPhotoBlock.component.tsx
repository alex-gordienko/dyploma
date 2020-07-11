/* tslint:disable */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { PhotoBlock, Photoes, Photo } from "./EditorPhotoBlock.styled";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IPhotoBuffer } from "../../../../App.types";

interface IPhotoBlockProps {
  photoesList: IPhotoBuffer[];
}

const EditorPhotoBlock = ({ photoesList }: IPhotoBlockProps) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 500,
    arrows: true
  };
  return (
    <PhotoBlock>
      <Photoes>
        <Slider {...settings}>
          {photoesList.map((photoUrl: IPhotoBuffer, indx: number) => {
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
    </PhotoBlock>
  );
};
export default EditorPhotoBlock;
