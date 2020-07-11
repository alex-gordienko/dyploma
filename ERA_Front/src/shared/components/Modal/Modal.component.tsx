import React, {Component} from 'react';
import {ButtonBlock} from '../EditorComponents/EditorComponents.styled';

import {StyledModal} from './Modal.styled';

interface ModalProps {
    show: boolean;
    type: 'warning'| 'accept' | 'editing';
    name: string;
    children: JSX.Element;
    isDisabled?: boolean;
    onOK: ()=> void;
    onCancel?: ()=> void;
}

export default class Modal extends Component<ModalProps>{
    render(){
        return(
            <React.Fragment>
                {this.props.show &&(
                    <StyledModal type={this.props.type}>
                        <h1>{this.props.name}</h1>
                        <div className='content'>
                            {this.props.children}
                        </div>
                        <ButtonBlock>
                            <button disabled={this.props.isDisabled} className='label-button' onClick={this.props.onOK}>OK</button>
                            {this.props.onCancel && 
                                <button className='label-button' onClick={this.props.onCancel}>Cancel</button>
                            }
                        </ButtonBlock>
                    </StyledModal>
                )}
            </React.Fragment>
        )
    }
}