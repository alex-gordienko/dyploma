/* tslint:disable */
import React from "react";
import Header from "./Header";
import StyledFilters from "./Filters.styled";
import Filters from "./FilterList/FilterItem.component";
import { ReactComponent as FilterIcon } from "../../../assets/icons/filter.svg";

interface IFilterComponentProps {
  contries: { id: number; name_en: string }[];
  cities: { id: number; country_id: number; name_en: string }[];
  filters: {
    username: string;
    country: string;
    city: string;
    date: string;
  };
  letSearch: (
    filterName: "Username" | "Date" | "Country" | "City",
    value: string
  ) => void;
}

const FilterComponent = ({
  contries,
  cities,
  filters,
  letSearch
}: IFilterComponentProps) => {
  return (
    <StyledFilters>
      <Header>
        <FilterIcon />
        <p className="filter-header">Filters</p>
      </Header>
      <Filters
        filters={filters}
        contries={contries}
        cities={cities}
        letSearch={letSearch}
      />
    </StyledFilters>
  );
};

export default FilterComponent;
