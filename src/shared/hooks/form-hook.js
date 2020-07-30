import { useReducer, useCallback } from 'react';

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let isFormValid = true;
            for (const inputId in state.inputs) {
                if(!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    isFormValid = isFormValid && action.isValid
                }
                else {
                    isFormValid = isFormValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.val,
                        isValid: action.isValid
                    }
                },
                formIsValid: isFormValid
            };
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                formIsValid: action.formIsValid 
            }
        default:
            return state;
    }
}

export const useForm = (initialValues, initialValidities) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialValues,
        formIsValid: initialValidities
    });

    const inputChangeHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            inputId: id,
            val: value,
            isValid: isValid
        })
    }, []);

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        });
    }, []);

    return [formState, inputChangeHandler, setFormData]
};