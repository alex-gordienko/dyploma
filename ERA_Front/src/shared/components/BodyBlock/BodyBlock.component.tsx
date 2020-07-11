/* tslint:disable */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Container from "../Container/Container.Pages.styled";
import AdaptiveBodyBlock, {Delimeter, Border} from "./BodyBlock.styled";
import PageConstructor from "../../PageConstructor/PageConstructor"

import GoogleMapBlock from "../GoogleMapBlock";
import Feed from "../Feed";
import { IPost, IComment, IFullDataUser } from "../../../App.types";
import { httpPost } from "../../../backend/httpGet";

interface IBodyBlockProps {
  mode: "Main Page" | "Profile";
  currentUser: IFullDataUser;
  isAnotherUser?:string;
  isPrivatePosts?: boolean;
  posts: IPost[];
  onSaveProgressOnLoadingPosts:(newFeed:IPost[])=>void;
  onError:(message:string)=>void;
}
const BodyBlock = ({ currentUser,
  mode, 
  isAnotherUser, 
  isPrivatePosts,
  posts, 
  onSaveProgressOnLoadingPosts, 
  onError }: IBodyBlockProps) => {
  const commentsStorage: IComment[]=[];
  var nullFilter = {username:"",country:"",city:"", date:""};
  const [postsFeed, setPostsFeed] = useState(posts);
  const [selectedPostID, setSelectedPostID] = useState(0);
  const [userPostFeed, setUserPostFeed] = useState(posts);
  const [comments, setComments] = useState(commentsStorage);


  const bodyBlockRef = useRef<HTMLDivElement>(null);

  const sendData=(url: string, datatype: "string" | "json", data: any)=>{
    httpPost(url, datatype, data).then(
        (response: any) => {
          const res: { operation: string; result: any } = JSON.parse(response);
          console.log(res);
          if(res.operation==="get all posts"){
            if(res.result==="No Results Found."){
            }
            else{
              let newFeed = postsFeed.concat(res.result);
              setPostsFeed(newFeed);
            }
          }
          else if(res.operation==="get user public posts"){
            if(res.result==="No Results Found."){
              if(userPostFeed.length>1)
                if(userPostFeed[0].username!==isAnotherUser)setUserPostFeed([]);
            }
            else{
              let newFeed = userPostFeed.concat(res.result);
              setUserPostFeed(newFeed);
              return
            }
          }
          else if(res.operation==="get comments"){
            if(res.result==="No Results Found."){
              setComments([]);
            }
            else{
              console.log("All "+res.result.length+" comments: ", res.result);
              setComments(res.result);
            }
          }
          else if(res.operation==='set rating'){
            if(isAnotherUser){
              setUserPostFeed(prevState=>{
                return prevState.map(post=>{
                  let updatedPost= post;
                  if(post.idPost===res.result.IdPost) updatedPost.rating = res.result.rating;
                  return updatedPost
                })
              })
            }
            else{
              setPostsFeed(prevState=>{
                return prevState.map(post=>{
                  let updatedPost= post;
                  if(post.idPost===res.result.IdPost) updatedPost.rating = res.result.rating;
                  return updatedPost
                })
              })
            }
          }
        },
        (error) => {console.error(`Rejected: ${error}`); onError("Connection error. Please, reload page")}
      )
  }

  let loadMorePosts=(count: number)=>{
    let postType = isPrivatePosts? "get user private posts":"get user public posts";
    let postData = isAnotherUser? 
    '{ "operation": "'+postType+'", '+
    '"json": {'+
      '"username": "'+isAnotherUser+'",'+
      '"currentUser": '+currentUser.idUsers+','+
      '"filters": '+JSON.stringify(nullFilter)+','+
      '"postnumber": '+ count +
    '}}'
     :'{ "operation": "get all posts", "currentUser": '+currentUser.idUsers+', "postnumber": '+count+' }';
     sendData("getPosts.php", "json",postData);
  }
  let loadComments=(postID: number)=>{
    if(postID!==0){
      let postData = '{ "operation": "get comments", "postID": '+postID+' }';
      sendData("getPosts.php", "json",postData);
    }
  }

  const onCreateComment =(idPost: number, comment:string)=>{
    var d = new Date();
      var dateTime: string =d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
      const prevPostState = postsFeed
        .filter(post => post.idPost === idPost);
      const newComment:IComment ={
        content: comment,
        date: dateTime,
        author: currentUser.username,
        rating: 0,
        userAvatar: currentUser.avatar,
        userRating: currentUser.rating
      };
      //console.log(" Current post: ", prevPostState);
      console.log("Creating new comment: ", newComment);
      setComments(prevState=>{return[...prevState, newComment]});

      const postData ='{ "operation": "create comment"'+
        ', "json": {' +
        ' "idUser": ' +
        currentUser.idUsers +
        ', "data": ' +
            '{ "content": "'+
              newComment.content +
              '", "rating": "' +
              newComment.rating +
              '", "date": "'+
              newComment.date +
              '", "idPost": "' +
              prevPostState[0].idPost +
            '"}'+
        '}}';
      sendData("createpost.php", "json", postData);
  }

  useEffect(()=>{
    if(!isAnotherUser && postsFeed.length<1){
      console.log("Preloading posts")
      loadMorePosts(0);
    }

  },[postsFeed, isAnotherUser])

  useEffect(()=>{
    console.log(posts);
    setUserPostFeed(posts);
  },[posts]);

  const onSetLike = (post: number, type: 'new'|'inversion'|'from dislike')=>{
    const postData ='{ "operation": "set rating"'+
        ', "json": {' +
        ' "idUser": ' +
        currentUser.idUsers +
        ', "data": ' +
            '{ "idPost": '+
                post+
              ', "setting": "like"'+
              ', "type":"'+
                type+
            '"}'+
        '}}';
      sendData("createpost.php", "json", postData);
  }

  const onSetDislike = (post: number, type: 'new'|'inversion'|'from like')=>{
    const postData ='{ "operation": "set rating"'+
        ', "json": {' +
        ' "idUser": ' +
        currentUser.idUsers +
        ', "data": ' +
            '{ "idPost": '+
                post+
              ', "setting": "dislike"'+
              ', "type":"'+
                type+
            '"}'+
        '}}';
      sendData("createpost.php", "json", postData);
  }

  var pageSize = bodyBlockRef.current? bodyBlockRef.current.offsetWidth :document.body.clientWidth;
  var minX = pageSize*0.29;

  const selectedMarker = (e: number) => {
    setSelectedPostID(e);
    loadComments(e);
  };
  return (
      <AdaptiveBodyBlock ref={bodyBlockRef} mode={mode}>
        <PageConstructor initSizes={[minX, (pageSize-minX)]}>
        {selectedPostID===0?
            <Feed
            type="Preview" 
            currentUser={currentUser.idUsers}
            data={isAnotherUser? userPostFeed: postsFeed} 
            onSelect={selectedMarker} 
            onCallNextPage={loadMorePosts}
            onLike={onSetLike}
            onDislike={onSetDislike}
          />:
          <Feed
            type="FullPost"
            currentUser={currentUser.idUsers}
            data={isAnotherUser? userPostFeed.find(e=> e.idPost===selectedPostID)
                  : postsFeed.find(e=> e.idPost===selectedPostID)
                  } 
            comments={comments}
            onSelect={selectedMarker} 
            onCreateComment={onCreateComment}
            onLike={onSetLike}
            onDislike={onSetDislike}
          />
          }
        <GoogleMapBlock 
            mode="Posts" 
            data={selectedPostID===0? 
                    isAnotherUser? userPostFeed: postsFeed
                  : isAnotherUser? userPostFeed.filter(e=> e.idPost===selectedPostID): postsFeed.filter(e=> e.idPost===selectedPostID)
                  }  
            selectedMarker={selectedMarker} />
        </PageConstructor>
      </AdaptiveBodyBlock>
  );
};

export default BodyBlock;
