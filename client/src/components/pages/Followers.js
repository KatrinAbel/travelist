import React, { Component } from "react";
import api from "../../api";
import { Table } from "reactstrap";

export default class followers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      users: [],
      followers: [],
      following: []
    };
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  isFollowing(user) {
    let idLoggedInUser = api.getLoggedInUserSync()._id;
    return user.followers.includes(idLoggedInUser);
  }
  handleFollowClick = userId => {
    api.postFollowStatus(userId).then(newUser => {
      // this.setState({
      //   users: this.state.users.map(user =>
      //     userId === user._id ? newUser : user
      //   )
      // });
      console.log("newUswer", newUser, "user", userId);
    });
  };

  render() {
    return (
      <Table>
        <tbody>
          {this.state.users
            .filter(users => {
              if (users._id !== api.getLoggedInUserSync()._id) return true;
            })
            .filter(user =>
              user.following.includes(api.getLoggedInUserSync()._id)
            )
            .filter(user =>
              user.username
                .toLowerCase()
                .includes(this.props.search.toLocaleLowerCase())
            )
            .map(user => (
              <tr>
                <td className="usernamesRow usernames">{user.username}</td>
                <td className="usernamesRow">
                  <button
                    className="btn buttons"
                    onClick={() => this.handleFollowClick(user._id)}
                    style={{ marginBottom: "1rem" }}
                  >
                    {this.isFollowing(user) ? "Unfollow" : "Follow"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  }
  followingHandler = () => {
    api
      .getFollowing()
      .then(followingData => {
        console.log("debug following frontend", followingData);
        this.setState({
          following: followingData
        });
        console.log("debug following", this.state.following);
      })
      .catch(err => console.log("error userprofile", err));
  };
  componentDidMount() {
    api.getAllUsers().then(users => {
      this.setState({
        users: users
      });
    });
  }
}
