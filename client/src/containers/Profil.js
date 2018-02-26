import React, { Component } from "react";
import { get, del } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

import DeleteButton from "../components/DeleteButton";
import PostsList from "../components/PostsList";
import FriendsList from "../components/FriendsList";
import { SmallButton, PageBody, FlexExtend } from "../styles/common";
import styled from "styled-components";

const Pseudo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;

  b {
    font-weight: 600;
    font-size: 24px;
  }

  span {
    font-weight: 300;
    margin-left: 12px;
  }
`;

const DetailsUser = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
  > span {
    display: inline-block;
  }
  > span + span {
    border-left: 1px solid #ccc;
    margin-left: 6px;
    padding-left: 6px;
  }
`;

const Header = FlexExtend.extend`
  display: flex;
  flex: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const Actions = styled.div`
  display: flex;
  align-items: flex-start;

  button {
    margin-left: 12px;
  }
`;

class Profil extends Component {
  state = {
    sex: "",
    birthDate: "",
    city: "",
    pseudo: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    loader: true
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.fetchProfil(nextProps.match.params.id);
    }
  }

  componentDidMount() {
    this.fetchProfil(this.props.match.params.id);
  }

  fetchProfil = profilId => {
    this.setState({
      loader: true
    });
    get(`/users/${profilId}`)
      .then(userInformations => {
        console.warn("userInformations", userInformations);
        this.setState({
          sex: userInformations.sex,
          birthDate: userInformations.birthDate,
          city: userInformations.city,
          pseudo: userInformations.pseudo,
          firstName: userInformations.firstName,
          lastName: userInformations.lastName,
          avatar: userInformations.avatar,
          loader: false
        });
      })
      .catch(error => {
        this.setState({
          loader: false
        });
        console.log("ERROR", error);
        this.props.history.goBack();
      });
  };

  editProfil = () => {
    this.props.history.push("/setProfil/" + this.props.match.params.id);
  };

  deleteProfil = () => {
    // TODO rajouter l'id pour checker un db si user identique et pour les actions admin
    del("/users")
      .then(() => {
        console.log("deleteProfil");
        localStorage.removeItem("token");
        this.props.history.push("/login");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const isCurrentUser =
      this.props.user && this.props.match.params.id === this.props.user.id;
    return (
      <PageBody className="Home">
        {this.state.loader ? (
          <p>Loading...</p>
        ) : (
          <FlexExtend>
            <img
              style={{ width: 200 + "px", height: "auto" }}
              src={process.env.REACT_APP_HOST + "/images/" + this.state.avatar}
              alt="avatar"
            />
            <Header>
              <div>
                <Pseudo>
                  <b>{this.state.pseudo}</b>
                  <span>
                    ({this.state.firstName} {this.state.lastName})
                  </span>
                </Pseudo>
                <DetailsUser>
                  {this.state.birthDate && <span>{this.state.birthDate}</span>}
                  {this.state.sex && <span>{this.state.sex}</span>}
                  {this.state.city && <span>{this.state.city}</span>}
                </DetailsUser>
              </div>
              {isCurrentUser && (
                <Actions>
                  <DeleteButton
                    delete={this.deleteProfil}
                    text="Supprimer le profil"
                  />
                  <SmallButton onClick={this.editProfil}>
                    Editer mon profil
                  </SmallButton>
                </Actions>
              )}
            </Header>
            <FriendsList />
            <PostsList />
          </FlexExtend>
        )}
      </PageBody>
    );
  }
}
export default withRouter(props => <Profil {...props} />);
