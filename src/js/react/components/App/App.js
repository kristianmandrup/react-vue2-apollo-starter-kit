import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import client from '../../../apollo';
import { createFragment } from 'apollo-client';
import config from '../../../config';
import { hashHistory } from 'react-router';
import {Grid, Row, Col, Button, Jumbotron} from 'react-bootstrap';
import Header from './Header';
import Hero from './Hero';
import Description from './Description';
import Footer from './Footer';

const FragmentDoc = gql`
fragment UserFragment on User {
  id
  username
}
`;

const userQuery = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      ...UserFragment
    }
  }
`;

const createUserQuery = gql `
  mutation CreateUserQuery($user: _CreateUserInput!){
    createUser(input: $user) {
      token
      changedUser {
        id
        username
      }
    }
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      // If we are logged in subscribe to the user and render the app.
      this.subscribeToUser(userId);
    } else {
      // We are not logged in so stop loading and render the landing page.
      this.setState({ // eslint-disable-line
        loading: false,
      });
    }
  }

  subscribeToUser(id) {
    const that = this;
    const observable = client.watchQuery({
      query: userQuery,
      fragments: createFragment(FragmentDoc),
      pollInterval: 60000,
      forceFetch: true,
      variables: {
        id,
      },
    });
    const subscription = observable.subscribe({
      next(result) {
        if (result && result.errors) {
          const unauthed = result.errors.reduce((acc, err) => (
            acc || err.status === 401
          ), false);
          if (unauthed) {
            localStorage.clear();
            that.setState({
              user: result.data.getUser,
              loading: false,
            });
          }
        } else {
          localStorage.setItem('currentUsername', result.data.getUser.username);
          that.setState({
            user: result.data.getUser,
            loading: false,
          });
          hashHistory.push('/home');
        }
      },
      error(error) {
        console.log(`Error subscribing to user: ${error.toString()}`);
        that.setState({
          loading: false,
        });
      }, // Network error, etc.
      complete() {
        // console.log(`Subscription complete`);
      },
    });
    this.setState({
      userSubscription: subscription,
    });
  }

  render() {
    return (
      <div>
        <Header />
        <Hero />
        <Description />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {};

const componentWithData = graphql(createUserQuery, {
  options: (ownProps) => ({
    variables: {
      user: {
        username: createNewUsername(),
        password: "password"
      }
    }
  }),
  props: ({ ownProps, mutate }) => ({
    createUser(data) {
      return mutate({
        variables: {
          user: {
            username: data.username,
            password: data.password
          }
        }
      }).then(({ data }) => {
        // Successfully created new user
        return data.createUser;
      }).catch((error) => {
        console.log('There was an error sending the query', error);
      });     
    }
  })
})(App);
export default componentWithData;
