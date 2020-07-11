import React from 'react';

import { ReactComponent as Preloader } from "../../../assets/icons/Blocks-0.6s-224px.svg";
import { StyledPreloader } from "./Preloader.styled";

interface IPreloader {
    message?: string;
}

const PreloaderComponent = ({message}:IPreloader) =>{
    return (
    <StyledPreloader>
        <Preloader/>
        <p>{message}</p>
    </StyledPreloader>
    )
}

export default PreloaderComponent;