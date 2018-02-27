import React, { Component } from "react";
import { get, post } from "../services/request.service";
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
    loading: true
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.fetchProfil(nextProps.match.params.id);
    }
  }

  componentDidMount() {
    this.fetchProfil(this.props.match.params.id);
  }

  // Display notification to user
  showInformation = (text, type, action) => {
    // TODO ==> use type argument for style settings
    // info or warning
    this.setState({
      alert: text
    });
    setTimeout(() => {
      this.setState({ alert: "" });
      action();
    }, 5000);
  };

  fetchProfil = profilId => {
    this.setState({
      loading: true
    });
    get(`/users/${profilId}`)
      .then(userInformations => {
        this.setState({
          sex: userInformations.sex,
          birthDate: userInformations.birthDate,
          city: userInformations.city,
          pseudo: userInformations.pseudo,
          firstName: userInformations.firstName,
          lastName: userInformations.lastName,
          avatar: userInformations.avatar,
          loading: false,
          alert: ""
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        console.log("ERROR", error);
        this.props.history.push(`/profil/${this.props.match.params.id}`);
      });
  };

  editProfil = () => {
    this.props.history.push("/setProfil/" + this.props.match.params.id);
  };

  deleteProfil = () => {
    // TODO rajouter l'id pour checker un db si user identique et pour les actions admin
    post("/users/deleteOne", { _id: this.props.match.params.id })
      .then(() => {
        if (
          this.props.user.profile === "admin" &&
          this.props.match.params.id !== this.props.user.id
        ) {
          this.showInformation("L'utilisateur a été supprimé", "info", () => {
            return this.props.history.push(`/profil/${this.props.user.id}`);
          });
        } else {
          console.log("deleteProfil");
          localStorage.removeItem("token");
          this.showInformation(
            "Votre profil a été supprimé. A bientôt",
            "info",
            () => this.props.history.push("/login")
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const isCurrentUserOrAdmin =
      (this.props.user && this.props.match.params.id === this.props.user.id) ||
      (this.props.user && this.props.user.profile === "admin");
    console.log(this.props);
    return (
      <PageBody className="Home">
        {this.state.loading ? (
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
              {isCurrentUserOrAdmin && (
                <Actions>
                  <DeleteButton
                    delete={this.deleteProfil}
                    buttonText="Supprimer le profil"
                    alertText="Etes vous de vouloir supprimer votre profil ?"
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
        {this.state.alert}
      </PageBody>
    );
  }
}
export default withRouter(props => <Profil {...props} />);
