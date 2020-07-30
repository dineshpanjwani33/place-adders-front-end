import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = props => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);

                setLoadedPlaces(responseData.places);

            }
            catch (err) {
                console.log(err);
            }
        }
        fetchPlaces();
    }, [sendRequest, userId])

    const placeDeleteHandler = (placeId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== placeId))
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className="center">
                {isLoading && <LoadingSpinner asOverlay />}
            </div>
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
        </React.Fragment>
    )
};

export default UserPlaces;