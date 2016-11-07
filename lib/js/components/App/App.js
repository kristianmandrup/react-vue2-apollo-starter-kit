'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\nfragment UserFragment on User {\n  id\n  username\n}\n'], ['\nfragment UserFragment on User {\n  id\n  username\n}\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  query GetUser($id: ID!) {\n    getUser(id: $id) {\n      ...UserFragment\n    }\n  }\n'], ['\n  query GetUser($id: ID!) {\n    getUser(id: $id) {\n      ...UserFragment\n    }\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  mutation CreateUserQuery($user: _CreateUserInput!){\n    createUser(input: $user) {\n      token\n      changedUser {\n        id\n        username\n      }\n    }\n  }\n'], ['\n  mutation CreateUserQuery($user: _CreateUserInput!){\n    createUser(input: $user) {\n      token\n      changedUser {\n        id\n        username\n      }\n    }\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactApollo = require('react-apollo');

var _graphqlTag = require('graphql-tag');

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _apollo = require('../../../apollo');

var _apollo2 = _interopRequireDefault(_apollo);

var _apolloClient = require('apollo-client');

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _reactRouter = require('react-router');

var _reactBootstrap = require('react-bootstrap');

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Hero = require('./Hero');

var _Hero2 = _interopRequireDefault(_Hero);

var _Description = require('./Description');

var _Description2 = _interopRequireDefault(_Description);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var FragmentDoc = (0, _graphqlTag2.default)(_templateObject);

var userQuery = (0, _graphqlTag2.default)(_templateObject2);

var createUserQuery = (0, _graphqlTag2.default)(_templateObject3);

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      loading: true
    };
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var token = localStorage.getItem('token');
      var userId = localStorage.getItem('userId');
      if (token && userId) {
        // If we are logged in subscribe to the user and render the app.
        this.subscribeToUser(userId);
      } else {
        // We are not logged in so stop loading and render the landing page.
        this.setState({ // eslint-disable-line
          loading: false
        });
      }
    }
  }, {
    key: 'subscribeToUser',
    value: function subscribeToUser(id) {
      var that = this;
      var observable = _apollo2.default.watchQuery({
        query: userQuery,
        fragments: (0, _apolloClient.createFragment)(FragmentDoc),
        pollInterval: 60000,
        forceFetch: true,
        variables: {
          id: id
        }
      });
      var subscription = observable.subscribe({
        next: function next(result) {
          if (result && result.errors) {
            var unauthed = result.errors.reduce(function (acc, err) {
              return acc || err.status === 401;
            }, false);
            if (unauthed) {
              localStorage.clear();
              that.setState({
                user: result.data.getUser,
                loading: false
              });
            }
          } else {
            localStorage.setItem('currentUsername', result.data.getUser.username);
            that.setState({
              user: result.data.getUser,
              loading: false
            });
            _reactRouter.hashHistory.push('/home');
          }
        },
        error: function error(_error) {
          console.log('Error subscribing to user: ' + _error.toString());
          that.setState({
            loading: false
          });
        },
        // Network error, etc.
        complete: function complete() {
          // console.log(`Subscription complete`);
        }
      });
      this.setState({
        userSubscription: subscription
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Header2.default, null),
        _react2.default.createElement(_Hero2.default, null),
        _react2.default.createElement(_Description2.default, null),
        _react2.default.createElement(_Footer2.default, null)
      );
    }
  }]);

  return App;
}(_react2.default.Component);

App.propTypes = {};

var componentWithData = (0, _reactApollo.graphql)(createUserQuery, {
  options: function options(ownProps) {
    return {
      variables: {
        user: {
          username: createNewUsername(),
          password: "password"
        }
      }
    };
  },
  props: function props(_ref) {
    var ownProps = _ref.ownProps;
    var mutate = _ref.mutate;
    return {
      createUser: function createUser(data) {
        return mutate({
          variables: {
            user: {
              username: data.username,
              password: data.password
            }
          }
        }).then(function (_ref2) {
          var data = _ref2.data;

          // Successfully created new user
          return data.createUser;
        }).catch(function (error) {
          console.log('There was an error sending the query', error);
        });
      }
    };
  }
})(App);
exports.default = componentWithData;