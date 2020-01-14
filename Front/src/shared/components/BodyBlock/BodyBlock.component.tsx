/* tslint:disable */
import React, { useState, useRef, useEffect } from "react";
import Container from "../Container/Container.Pages.styled";
import AdaptiveBodyBlock from "./BodyBlock.styled";

import GoogleMapBlock from "../GoogleMapBlock";
import Feed from "../Feed";
import { IPost } from "../../../App.types";

interface IBodyBlockProps {
  posts: IPost[];
}
const BodyBlock = ({ posts }: IBodyBlockProps) => {
  const [id, setID] = useState(0);
  const [feedWidth, setFeedWidth] = useState("29%");
  const [mapWidth, setMapWidth] = useState("71%");
  const feedRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      if (
        feedRef.current &&
        !feedRef.current.contains(e.target as HTMLElement)
      ) {
        setFeedWidth("29%");
        setMapWidth("71%");
      } else {
        setFeedWidth("45%");
        setMapWidth("55%");
      }
    };
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [feedWidth]);

  const selectedMarker = (e: number) => {
    setID(e);
  };
  return (
    <AdaptiveBodyBlock>
      <Container>
        <div ref={feedRef} style={{ width: feedWidth, height: "inherit" }}>
          <Feed data={posts} selectedMarker={id} onSelect={selectedMarker} />
        </div>
        <div ref={mapRef} style={{ width: mapWidth, height: "inherit" }}>
          <GoogleMapBlock data={posts} selectedMarker={selectedMarker} />
        </div>
      </Container>
    </AdaptiveBodyBlock>
  );
};

export default BodyBlock;
