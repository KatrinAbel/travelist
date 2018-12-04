import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import api from '../../api';
import AddTip from './AddTip';
import { Link } from 'react-router-dom'
import TripDetailTip from "./TripDetailTip"

class TripDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      collapse: false, 
      title: "",
      selectedTrip: [],
      tips: [],
      location: "",
      description: "",
      category: "",
      categoryBtn: "",
    };
  }

  addTip(tip) {
    this.setState({
      tips: [...this.state.tips, tip]
    })
  }

  toggle  = (categoryBtn) => {
    this.setState({ 
      categoryBtn: categoryBtn,
      collapse: !this.state.collapse 
    });
  }

  render() {
    let id = this.props.match.params.id

    const categories = []
    const tipArray = []

    let tips = this.state.tips.sort((a,b) => (a.category > b.category ? 1 : -1))
    
    // Push categories to array
    for (let i = 0; i < tips.length; i++) {
    if (i === 0 || tips[i].category !== tips[i-1].category) {
      categories.push(
      <Button color="primary" onClick={() => this.toggle(tips[i].category)} style={{ marginBottom: '1rem' }}>{tips[i].category}</Button>
      )}
    }

    // Push filtered Tips into array
    let filteredTips = tips.filter(t => {
      return t.category === this.state.categoryBtn
    }) 

    for (let i = 0; i < filteredTips.length; i++) {
      tipArray.push(
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <TripDetailTip 
              tipId={filteredTips[i]._id} 
              title={filteredTips[i].title} 
              category={filteredTips[i].category}
              description={filteredTips[i].description} 
              location= {filteredTips[i].location} 
              id={this.props.match.params.id}
              />
            </CardBody>
          </Card>
          </Collapse>
        )
        console.log("debug tipArray", tipArray)
    }

    return (
      <div>

        <div>{categories}</div>
        <div>{tipArray}</div>
      
        <div>
          <AddTip 
          id={this.props.match.params.id}
          onAdd={tip => this.addTip(tip)}
          destination={this.state.selectedTrip.destination}
          />
        </div>

        <div>
          <Link to={`search/${id}`}>Search for friends´ tips</Link>
        </div>

      </div>
    );
  }

  componentDidMount() {
    let id = this.props.match.params.id

    api.getTrip(id)
      .then(trip => {
        this.setState({
          selectedTrip: trip,
        })
        console.log("debug selected trip", this.state.selectedTrip)
      })
    api.getTips(id)
      .then(tips => {
        this.setState({
          tips: tips
        })
      })
      .catch(err => console.log(err))
  }

}

export default TripDetail;