/* tslint:disable */
import React from "react";
import Header from "./Header";
import StyledFilters from "./Filters.styled";
import Filters from "./FilterList/FilterItem.component";
import { ReactComponent as FilterIcon } from "../../../assets/icons/filter.svg";

export default function FilterComponent() {
  return (
    <StyledFilters>
      <Header>
        <FilterIcon />
        <p className="filter-header">Filters</p>
      </Header>
      <Filters />
    </StyledFilters>
  );
}
