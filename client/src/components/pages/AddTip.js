import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import api from '../../api'
import { Link } from 'react-router-dom'


class AddTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      category: "",
      title: "",
      location: "",
      description: "",
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleInputChange(stateFieldName, event){
    let newState = {}
    newState[stateFieldName] = event.target.value
    this.setState(newState)
  }

  handleClick(e){
    e.preventDefault()
    let id = this.props.id
    let data = {
      category: this.state.category,
      title: this.state.title,
      location: this.state.location,
      description: this.state.description,
    }
   
    api.postTip(id, data)
    .then(newTip => {
      this.toggle()
      this.setState({
      category: "",
      title: '',
      location: '',
      description: '',
      })
      this.props.history.push('/trip-detail/'+ id)
    })
      .catch(err => console.log(err)
      )
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>Add new tip</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Add tip</ModalHeader>
          <form>
          <ModalBody>
            Category: <input type="text" style={{border: 'solid'}} value={this.state.category} onChange={(e) => this.handleInputChange("category", e)} /> <br/>
            Title: <input type="text" style={{border: 'solid'}} value={this.state.title} onChange={(e) => this.handleInputChange("title", e)} /> <br/>
            Location: <input type="text" style={{border: 'solid'}} value={this.state.location} onChange={(e) => this.handleInputChange("location", e)} /> <br/>
            Description: <input type="text" style={{border: 'solid'}} value={this.state.description} onChange={(e) => this.handleInputChange("description", e)} /> <br/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(e) => this.handleClick(e)}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
          </form>
        </Modal> 

        </div>
    );
  }
}

export default AddTip;