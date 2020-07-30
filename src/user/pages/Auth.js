import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './Auth.css';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

    const [formState, inputChangeHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: null
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode)
    }

    const formHandler = async (event) => {
        event.preventDefault();

        console.log(formState.inputs);

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL+'/users/login',
                    'POST',
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                );

                auth.login(responseData.userId, responseData.token);
            }
            catch (err) {

            }
        }
        else {
            try {
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);

                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL+'/users/signup',
                    'POST',
                    {},
                    formData
                );
                auth.login(responseData.userId, responseData.token);
            }
            catch (err) {
            }
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <form onSubmit={formHandler}>
                    {!isLoginMode &&
                        <Input
                            id="name"
                            element="input"
                            label="Your Name"
                            type="text"
                            validators={[VALIDATOR_REQUIRE]}
                            errorText="Plase enter a valid name"
                            onInput={inputChangeHandler}
                        />}
                    {!isLoginMode && <ImageUpload center id="image" onInput={inputChangeHandler} errorText="Please provide an image!" />}
                    <Input
                        id="email"
                        element="input"
                        label="E-Mail"
                        type="email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Plase enter a valid email"
                        onInput={inputChangeHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        label="Password"
                        type="password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password (min. 6 characters)"
                        onInput={inputChangeHandler}
                    />
                    <Button type="submit" disabled={!formState.formIsValid}>{isLoginMode ? 'LOGIN' : 'SIGN UP'}</Button>
                </form>
                <Button invert onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGN UP' : 'LOGIN'}</Button>
            </Card>
        </React.Fragment>
    )
};

export default Auth;