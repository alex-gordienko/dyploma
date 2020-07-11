/* tslint:disable */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Container from "../Container/Container.Pages.styled";
import StyledPeopleComponent from "./PeopleComponent.styled";
import Label from "./Label";
import PeopleFeed from "./PeopleFeed";
import Filters from "../Filters";
import { IFullDataUser, ISearchedUser, ICountriesAndCities } from "../../../App.types";
import { Redirect } from "react-router-dom";
import { httpPost } from "../../../backend/httpGet";

interface IPeopleComponentProps {
  currentUser: IFullDataUser;
  userNameToSearchFriends?: string;
  contries: {id: number;name_en: string;}[];
  cities: {id: number; country_id: number;name_en: string;}[];
  onError: (errorMessage: string)=>void;
}
const PeopleComponent = ({ currentUser, contries, cities, onError, userNameToSearchFriends}: IPeopleComponentProps) => {
  var nullPeople: ISearchedUser[] = [];
  var nullFilter = {username:"",country:"",city:"", date:""};
  const [searchedPeoples, setSearchedPeoples] = useState(nullPeople);
  const [friends, setFriends] = useState(nullPeople);
  const [invites, setInvites] = useState(nullPeople);
  const [blocked, setBlocked] = useState(nullPeople);
  const [filters, setFilters] = useState(nullFilter);
  const [selectedTab, setSelectedTab] = useState(1);

  const sendToServer = (
    url: string,
    datatype: "string" | "json",
    oldData: ISearchedUser[],
    data: string,
  ) => {
    httpPost(url, datatype, data)
        .then(
          (response: any) => {
            const res: { operation: string; result: any} = JSON.parse(response);
            console.log(res);
            if(res.operation==="Search Peoples"){
              if(res.result==="No Results Found"){
                if(oldData.length<1) setSearchedPeoples([]);
              }
              else{
                let newFeed = oldData.concat(res.result);
                setSearchedPeoples(newFeed);
              } 
            }
            if(res.operation==="Search Friends"){
              if(res.result=== "Friends not found"){
                if(oldData.length<1) setFriends([]);
              }
              else{
                let newFeed = oldData.concat(res.result);
                setFriends(newFeed);
              } 
            }
            if(res.operation==="Search Invites"){
              if(res.result=== "Invites not found"){
                if(oldData.length<1) setInvites([]);
              }
              else {
                let newFeed = oldData.concat(res.result);
                setInvites(newFeed);
              }
            }
            if(res.operation==="Search Blocked"){
              if(res.result=== "Blocks not found"){
                if(oldData.length<1) setBlocked([]);
              }
              else {
                let newFeed = oldData.concat(res.result);
                setBlocked(newFeed);
              }
            }
          },
          error => onError("Server Error, Please, try again")
        )
  }

  const searchPeople = (
        filter= filters,
        oldData= searchedPeoples,
        preloadedPeople=searchedPeoples.length
  )=>{
      let postData ='{ "operation": "Search Peoples", '+
      '"json": {'+
        '"username": "'+currentUser.username+'",'+
        '"filters": '+JSON.stringify(filter)+','+
        '"page": '+preloadedPeople+' '+
      '}}';
      sendToServer("userSearcher.php", "json", oldData, postData);
  }

  const searchFriends = (
    username: string,
    filter= filters,
    oldData=friends,
    preloadedPeople=friends.length
  ) =>{
      let postData ='{ "operation": "Search Friends", '+
      '"json": {'+
        '"username": "'+username+'",'+
        '"filters": '+JSON.stringify(filter)+','+
        '"page": '+preloadedPeople+' '+
      '}}';
      sendToServer("userSearcher.php", "json", oldData, postData);
  }

  const searchInvites = (
    username: string,
    filter= filters,
    oldData=invites,
    preloadedPeople=invites.length
  ) =>{
      let postData ='{ "operation": "Search Invites", '+
      '"json": {'+
        '"username": "'+username+'",'+
        '"filters": '+JSON.stringify(filter)+','+
        '"page": '+preloadedPeople+' '+
      '}}';
      sendToServer("userSearcher.php", "json", oldData, postData);
  }

  const searchBlocked = (
    username: string, 
    filter= filters,
    oldData=blocked, 
    preloadedPeople=blocked.length
  ) =>{
      let postData ='{ "operation": "Search Blocked", '+
      '"json": {'+
        '"username": "'+username+'",'+
        '"filters": '+JSON.stringify(filter)+','+
        '"page": '+preloadedPeople+' '+
      '}}';
      sendToServer("userSearcher.php", "json", oldData, postData);
  }

  useEffect(()=>{
    setFilters({
      username: '',
      country: '',
      city: '',
      date: ''
    })
    if(selectedTab===1){
      searchPeople();
    }
    else if(selectedTab===2){
      searchFriends(userNameToSearchFriends?
        userNameToSearchFriends
        :currentUser.username);
    }
    else if(selectedTab===3){
      searchInvites(currentUser.username);
    }
    else if(selectedTab===4){
      searchBlocked(currentUser.username);
    }
  },[selectedTab])

  

  const saveFilterProperty = (name: "Username"|"Date"|"Country"|"City", value: string)=>{
    setFilters({
      username: name==="Username"? value: filters.username,
      country: name==="Country"? value: filters.country,
      city: name==="City"? value: filters.city,
      date: name ==="Date"? value: filters.date
    })
    if(selectedTab===1){
      searchPeople({
        username: name==="Username"? value: filters.username,
        country: name==="Country"? value: filters.country,
        city: name==="City"? value: filters.city,
        date: name ==="Date"? value: filters.date
      }, 
      [], 0);
    }
    else if(selectedTab===2){
      searchFriends(
        userNameToSearchFriends?
        userNameToSearchFriends
        :currentUser.username,
        {
          username: name==="Username"? value: filters.username,
          country: name==="Country"? value: filters.country,
          city: name==="City"? value: filters.city,
          date: name ==="Date"? value: filters.date
        }, 
        [], 0);
    }
    else if(selectedTab===3){
      searchInvites(
        currentUser.username,
        { username: name==="Username"? value: filters.username,
          country: name==="Country"? value: filters.country,
          city: name==="City"? value: filters.city,
          date: name ==="Date"? value: filters.date
        },
        [], 0);
    }
    else if(selectedTab===4){
      searchBlocked(
        currentUser.username,
        { username: name==="Username"? value: filters.username,
          country: name==="Country"? value: filters.country,
          city: name==="City"? value: filters.city,
          date: name ==="Date"? value: filters.date
        }, 
        [], 0);
    }
  }

  const onCallNextPage=()=>{
    if(selectedTab===1){
      searchPeople();
    }
    else if(selectedTab===2){
      searchFriends(userNameToSearchFriends?
        userNameToSearchFriends
        :currentUser.username);
    }
    else if(selectedTab===3){
      searchInvites(currentUser.username);
    }
    else if(selectedTab===4){
      searchBlocked(currentUser.username);
    }
  }

  const TabSelection = (mode: "search"| "friends" | "blocked" | "invite")=>{
    console.log(mode);
    setSelectedTab(mode==="search"? 1: mode==="friends"? 2:mode==="invite"? 3: 4)
  }

  const onSelect = (userName: string) =>{
    return <Redirect to={"/profile/"+userName}/>
  }
  return (
      <Container>
          <Label selectedCaption={selectedTab} onSelect={TabSelection}/>
          <StyledPeopleComponent>
            <div style={{width: "30%"}}>people nearby</div>
            <PeopleFeed 
              currentUser={currentUser} 
              data={selectedTab===1? searchedPeoples
                    :selectedTab===2? friends
                    :selectedTab===3? invites
                    :selectedTab===4? blocked
                    :[]} 
              onSelect={onSelect}
              onCallNextPage={onCallNextPage}
            />
            <Filters 
              contries={contries} 
              cities={cities} 
              filters={filters} 
              letSearch={saveFilterProperty}
            />
          </StyledPeopleComponent>
      </Container>
  );
};

export default PeopleComponent;
