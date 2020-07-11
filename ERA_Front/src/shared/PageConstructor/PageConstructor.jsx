import React from "react";
import ReactDOM from "react-dom";
import PageConstructor from "./PageConstructor.styled"

export default class ResizablePanels extends React.Component {
  eventHandler = null

  constructor (props) {
    super(props)
    
    this.state = {
      isDragging: false,
      panels: this.props.initSizes
    }
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this).addEventListener('mousemove', this.resizePanel)
    ReactDOM.findDOMNode(this).addEventListener('mouseup', this.stopResize)
    ReactDOM.findDOMNode(this).addEventListener('mouseleave', this.stopResize)
  }
  
  startResize = (event, index) => {
    this.setState({
      isDragging: true,
      currentPanel: index,
      initialPos: event.clientX
    })
  }
  
  stopResize = () => {
    if (this.state.isDragging) {
      console.log(this.state)
      this.setState(({panels, currentPanel, delta}) => ({
        isDragging: false,
        panels: {
          ...panels,
          [currentPanel]: (panels[currentPanel] || 0) - delta,
          [currentPanel - 1]: (panels[currentPanel - 1] || 0) + delta
        },
        delta: 0,
        currentPanel: null
      }))
    }
  }
  
  resizePanel = (event) => {
    var minX = this.props.initSizes[0];
    var maxX = this.props.initSizes[1];
    if (this.state.isDragging &&event.clientX>minX && event.clientX<maxX ) {
      const delta = event.clientX - this.state.initialPos
      this.setState({
        delta: delta
      })
    }
  }
  
  render() {
    var valid = this.props.initSizes.length===this.props.children.length? true: false;
    const rest = this.props.children.slice(1)
    return valid?(
        <PageConstructor onMouseUp={() => this.stopResize()}>
        <div className="panel" style={{width: `${this.state.panels[0]}px`, height:"inherit"}}>
          {this.props.children[0]}
        </div>
        {[].concat(...rest.map((child, i) => {
          return [
            <div onMouseDown={(e) => this.startResize(e, i + 1)}
              key={"resizer_" + i}
              style={this.state.currentPanel === i+1 ? {left: this.state.delta} : {}}
              className="resizer"></div>,
            <div key={"panel_" + i} className="panel" style={{width: this.state.panels[i + 1]-8, height:"inherit"}}>
              {child}
            </div>
          ]
        }))}
      </PageConstructor>
    ):<div>Not Valid Count of child nodes({this.props.children.length}) and initial sizes({this.props.initSizes.length})</div>
  }
}