/* tslint:disable */
import originalStyled, { CreateStyled } from "@emotion/styled";
import { ITheme } from "./variables";

export const styled = originalStyled as CreateStyled<ITheme>;
