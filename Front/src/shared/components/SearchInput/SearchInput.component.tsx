/* tslint:disable */
import React from "react";
import Input from "../Input";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";

interface ISearchInput {
  onChanged: (text: string) => void;
}

export default function SearchInput({ onChanged }: ISearchInput) {
  return (
    <Input
      onChanged={onChanged}
      prependComponent={<SearchIcon />}
      type="Search"
      placeholder="Search"
    />
  );
}
