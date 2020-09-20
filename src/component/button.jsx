import React, {Component} from 'react';
import './button.css'

class Button extends Component {
    state ={}
    render () {
        return (
            <button className={`btn button-promo ${this.props.className}`} onClick={this.props.onClick}>
                {this.props.children}
            </button>
        )
    }
}

export default Button
