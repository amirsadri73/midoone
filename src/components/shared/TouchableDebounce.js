import React, { Component } from "react"
import { TouchableHighlight,TouchableWithoutFeedback } from "react-native"

class TouchableDebounce extends Component {

  constructor(props) {
    super(props)
  }

  debounce(callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => callback.apply(context, callbackArgs)

    return function() {
      callbackArgs = arguments
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        disabled={this.props.disabled}
        style ={this.props.style}
        onPress= {
          this.debounce(() => {
            this.props.onPress()
          }, 300)
        }>
        {this.props.children}
      </TouchableWithoutFeedback>
    )
  }
}

export default TouchableDebounce
