/* tslint:disable */
import React from "react";
import Select from "../../Select";
import { FilterData } from "./FilterItem.constants";
import FilterBlock from "./FilterItem.styled";

export default function FilterItem() {
  return (
    <div>
      {FilterData.map(item => {
        const { filtername, values } = item;
        return (
          <FilterBlock key={filtername}>
            <div className="filter-label">{filtername}</div>
            <Select className="filter-select" items={values} />
          </FilterBlock>
        );
      })}
    </div>
  );
}
