/* tslint:disable */
import React, { useState, useEffect, useCallback } from "react";
import EditorSelect from "../../EditorComponents/EditorSelect/EditorSelect.component";
import EditorTextInput from "../../EditorComponents/EditorTextInput/EditorTextInput.component";
import EditorDate from "../../EditorComponents/EditorDate/EditorDate.component";
import AutoComplete from "../../EditorComponents/EditorAutoComplete";

import { FilterData } from "./FilterItem.constants";
import FilterBlock from "./FilterItem.styled";

interface IFilterItemProps {
  contries: { id: number; name_en: string }[];
  cities: { id: number; country_id: number; name_en: string }[];
  letSearch: (
    filterName: "Username" | "Date" | "Country" | "City",
    value: string
  ) => void;
  filters: {
    username: string;
    country: string;
    city: string;
    date: string;
  };
}

interface IFilterItemState {
  selectedUsernameBuf: string;
  visible: string;
}
/*
class FilterComponent extends React.Component<IFilterItemProps,IFilterItemState>{
  constructor(props:Readonly<IFilterItemProps>){
    super(props);
    this.state={
      selectedUsernameBuf: this.props.filters.username,
      visible: "none"
    }
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.outputContryData = this.outputContryData.bind(this);
    this.outputCityData = this.outputCityData.bind(this);
  };

  componentWillReceiveProps(){
    console.log(this.state);
    console.log(this.props);
    this.setState({
      visible: this.props.cities===[{id: 0, country_id: 0, name_en: ""}]?
        "none"
        : "initial",
    },()=>{
      this.forceUpdate();
      }
    )
  }

  private onChange(username: string){
    this.setState({...this.state, selectedUsernameBuf:username});
  };
  private onKeyDown(key: React.KeyboardEvent<HTMLInputElement>){
    if(key.key=== "Enter"){
      this.props.letSearch("Username", this.state.selectedUsernameBuf);
    }
  }
  private outputContryData(res:string){
    this.props.letSearch("Contry", res);
  };

  private outputCityData(res: string){
    this.props.letSearch("City", res);
  }
  public render(){
    var date= new Date();
    var month = date.getMonth()<10? "0"+(date.getMonth()+1): date.getMonth()+1;
    return(
      <div>
      <EditorTextInput
              key={1}
              label="Username"
              required={false}
              placeholder="Input username"
              value={this.state.selectedUsernameBuf}
              lenght="TextInput"
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}
              />
      <EditorDate
              key={2}
              label="Birthday"
              value={date.getFullYear()+"-"+month+"-"+date.getDate()}
              onChange={(e:string)=>{this.props.letSearch("Date", e);}}
              />
      <AutoComplete
              key={3}
              label="Country"
              inputData={Array.from(this.props.contries, element=> element.name_en)}
              outputData={this.outputContryData}
      />
      <div style={{display: this.state.visible}}>
        <AutoComplete
              key={4}
              label="City"
              inputData={Array.from(this.props.cities, element=> element.name_en)}
              outputData={this.outputCityData}
            />
      </div>
    </div>
    )
  }
}
*/
const FilterItem = ({
  contries,
  cities,
  filters,
  letSearch
}: IFilterItemProps) => {
  var date = new Date();
  const month =
    date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const [value, setValue] = useState(filters.username);
  const [visible, setVisible] = useState(false);
  const [selectedContry, setSelectedContryBuf] = useState("");
  const [selectedCity, setSelectedCityBuf] = useState("");
  const [citiesBuf, setCitiesBuf] = useState([""]);

  useEffect(() => {
    setVisible(false);
    setVisible(
      filters.country !== "" &&
        filters.country === selectedContry &&
        citiesBuf !== [""]
        ? true
        : false
    );
  }, [filters]);

  const onChange = (value: string) => {
    setValue(value);
  };

  const onKeyDown = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.key === "Enter") {
      letSearch("Username", value);
    }
  };

  const outputContryData = (res: string) => {
    setVisible(false);
    setSelectedContryBuf(res);
    var newBuf =
      res !== ""
        ? cities.filter(
            element =>
              element.country_id ===
              contries.find(element => element.name_en === res)!.id
          )
        : [{ id: 0, country_id: 0, name_en: "" }];
    setCitiesBuf(Array.from(newBuf, element => element.name_en));
    letSearch("Country", res);
  };

  const outputCityData = (res: string) => {
    setSelectedCityBuf(res);
    letSearch("City", res);
  };

  return (
    <div>
      <EditorTextInput
        key={1}
        label="Username"
        required={false}
        placeholder="Input username"
        value={value}
        lenght="TextInput"
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
      <EditorDate
        key={2}
        label="Birthday"
        value={date.getFullYear() + "-" + month + "-" + date.getDate()}
        onChange={(e: string) => {
          letSearch("Date", e);
        }}
      />
      <AutoComplete
        key={3}
        label="Country"
        initValue={selectedContry}
        inputData={Array.from(contries, element => (
          <div key={element.name_en}>{element.name_en}</div>
        ))}
        outputData={outputContryData}
      />
      {visible ? (
        <AutoComplete
          key={4}
          label="City"
          initValue={selectedCity}
          inputData={citiesBuf.map(city => (
            <div key={city}>{city}</div>
          ))}
          outputData={outputCityData}
        />
      ) : null}
    </div>
  );
};

//export default FilterComponent;
export default FilterItem;
