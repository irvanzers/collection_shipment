import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

export default function RequireAuth (ComposedComponent) {
    class Authenticate extends Component {
        static propTypes = {
            isAuthenticated: PropTypes.bool.isRequired,
        };
        UNSAFE_componentWillMount() {
            if (!this.props.isAuthenticated) {
                this.props.navigation.navigate('LoginScreen');
            }
        }
        UNSAFE_componentWillUpdate(nextProps) {
            if (!nextProps.isAuthenticated) {
                this.props.navigation.navigate('LoginScreen');
            }
        }
        render() {
            return <ComposedComponent {...this.props} />;
        }
    }
    function mapStateToProps(state) {
        return {
            isAuthenticated: state.auth.isAuthenticated
        };
    }

    return connect(mapStateToProps)(Authenticate);
}
