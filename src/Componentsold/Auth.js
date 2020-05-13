import React, { useEffect, useState } from "react";
import useStore from "../store.js";

// Firebase anonymous upgrade to regular account: https://firebase.google.com/docs/auth/web/anonymous-auth?authuser=1
const { firebase } = window;

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { user: {} };
  }

  componentDidMount = () => {
    firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        // ...
      } else {
        // User is signed out.
        // ...
      }
      // ...
      this.setState({ user });
    });
  };

  render = () => {
    return <div />;
    return <div>{JSON.stringify(this.state.user)}</div>;
  };
}
