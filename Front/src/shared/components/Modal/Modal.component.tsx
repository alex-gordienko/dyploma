import React, { FC } from "react";
import { ButtonBlock } from "../EditorComponents/EditorComponents.styled";

import { StyledModal, ModalFullScreenContainer } from "./Modal.styled";

interface IModalProps {
  show: boolean;
  type: "warning" | "accept" | "editing";
  name: string;
  children: JSX.Element;
  isDisabled?: boolean;
  onOK: () => void;
  onCancel?: () => void;
}

const Modal: FC<IModalProps> = (props: IModalProps) => {
  const onOutsideFormClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      return props.onCancel();
    }
  };

  return (
    <React.Fragment>
      {props.show && (
        <ModalFullScreenContainer onClick={onOutsideFormClick}>
          <StyledModal type={props.type}>
            <h1>{props.name}</h1>
            <div className="content">{props.children}</div>
            <ButtonBlock>
              <button
                disabled={props.isDisabled}
                className="label-button"
                onClick={props.onOK}
              >
                OK
              </button>
              {props.onCancel && (
                <button className="label-button" onClick={props.onCancel}>
                  Cancel
                </button>
              )}
            </ButtonBlock>
          </StyledModal>
        </ModalFullScreenContainer>
      )}
    </React.Fragment>
  );
};

export default Modal;
