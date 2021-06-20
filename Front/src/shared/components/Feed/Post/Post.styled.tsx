/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const StyledPost = styled.div`
  max-width: inherit;
  margin: 0px 0px 5px 0px;
  text-align: left;
  color: ${(props: any) => props.theme.colors.secondaryBody};
  font-family: ${(props: any) => props.theme.fontFamily.body};
  font-size: ${(props: any) => props.theme.fontSize.body};
  cursor: pointer;
  background: transparent;
  &:hover {
    background: ${(props: any) => props.theme.colors.secondaryHover};
  }
`;

export const Head = styled.div`
  display: flex;
  margin-left: 5px;
  .leftBlock {
  }
  .rightBlock {
    margin-left: auto;
    padding: 10px 10px 1px 0;
  }
`;

export const Label = styled.div`
  font-size: ${(props: any) => props.theme.fontSize.title};
  max-width: 60vh;
  margin-right: auto;
`;

export const Author = styled.div``;

export const Body = styled.div``;

export const Photoes = styled.div`
  margin-bottom: 30px;
`;
export const Photo = styled.div`
  max-width: 100vh;
  max-height: 70vh;
  > img {
    max-width: 100%;
    max-height: 70vh;
    margin: 0px auto 0px auto;
  }
`;

export const Text = styled.div`
  margin-left: 5px;
`;

export const Time = styled.div`
  text-align: right;
  color: ${(props: any) => props.theme.colors.secondaryBody};
  font-style: oblique;
`;

export const Rating = styled.div`
  width: 100%;
  margin-left: 5px;
  display: table;
  .content {
    display: table-cell;
    text-align: center;
    font-family: ${props => props.theme.fontFamily.body};
    font-size: ${props => props.theme.fontSize.body};
    font-weight: bold;
  }
`;

export const Footer = styled.div`
  p {
    margin: 5px auto;
    text-align: center;
  }
`;

export const Comments = styled.div`
  margin-top: 10px;
`;

export const Comment = styled.div<{ Rating: number }>`
  .blocks {
    display: flex;
    .left-block {
      width: 10vh;
      text-align: center;
      background-color: ${props => props.theme.colors.button.color};
      .rating {
        font-family: ${props => props.theme.fontFamily.body};
        font-size: ${props => props.theme.fontSize.body};
        font-weight: 600;
      }
      .setRate {
        text-decoration: none;
        font-family: ${props => props.theme.fontFamily.body};
        font-size: ${props => props.theme.fontSize.body};
        font-weight: 600;
        background-color: ${props => props.theme.colors.button.color};
        outline: none;
        color: ${props => props.theme.colors.button.textColor};
        padding: 5px 5px 5px 5px;
        :hover {
          -webkit-transition: all 0.3s ease;
          -moz-transition: all 0.3s ease;
          -o-transition: all 0.3s ease;
          transition: all 0.3s ease;
          background-color: ${props => props.theme.colors.button.hoverColor};
          color: ${props => props.theme.colors.button.hoverTextColor};
        }
      }
    }
    .right-block {
      width: 90vh;
      display: inline-flex;
      .avatar {
        border: 1px solid ${props => props.theme.colors.primaryBackground};
        border-radius: 15px;
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
      .data {
        width: 100%;
        .head {
          display: flex;
          margin-botton: 5px;
          .username {
            color: hsl(${props => props.Rating}, 100%, 50%);
            font-weight: bold;
            margin-right: auto;
            text-decoration: none;
          }
          .date {
            margin-left: auto;
            font-style: oblique;
          }
        }
        .content {
        }
      }
    }
  }
`;
