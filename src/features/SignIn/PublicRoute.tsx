import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import useUserState from './redux/useUserState';

const PublicRoute = ({component: Component, restricted, ...rest}: any) => {
const { isValid } = useUserState({provider: process.env.REACT_APP_AUTHPROVIDER});

    return (
        <Route {...rest} render={props => (
            isValid && restricted ?
                <Redirect to="/dashboard" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;