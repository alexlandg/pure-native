
import React from 'react'

const random = () => Math.random()


class Component extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      key: random()
    }

    if (this.props.update) {
      this.update = this.props.update
      this.id = this.props.id ? this.props.id instanceof Array ? this.props.id : [this.props.id] : [random()]
      this.from = this.props.from ? this.props.from instanceof Array ? this.props.from : [this.props.from] : [random()]
      this.cb = () => this.setState({key: random()})
    }
  }
  componentWillMount(){
    this.update && this.id.forEach(id => this.from.forEach(from =>
      this.update.sub(id, from, this.cb)
    ))
    this.props.willmount && this.props.willmount()
  }
  componentDidMount(){
    this.props.didmount && this.props.didmount()
  }
  shouldComponentUpdate(_, nextstate){
    return nextstate.key !== this.state.key
      ? (this.props.willupdate && this.props.willupdate(), true)
      : false
  }
  componentDidUpdate(){
    this.props.didupdate && this.props.didupdate()
  }
  componentWillUnmount(){
    this.update && this.id.forEach(id => this.from.forEach(from =>
      this.update.unsub(id, from)
    ))
    this.props.willunmount && this.props.willunmount()
  }
  render(){
    return this.props.children()
  }
}

module.exports = Component
