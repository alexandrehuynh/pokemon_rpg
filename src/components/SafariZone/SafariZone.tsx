import * as _React from 'react'; 
// import React from 'react'; 

// internal imports
import { useGetSafari, SafariZoneProps } from '../../customHooks';

export const SafariZone = () => {
    // setup our hooks
    const { safariData } = useGetSafari() 

    console.log(safariData)
    return (
        <div>
            <h1 style={{ marginTop: '50px' }}>Welcome to Safari Zone: Feel Free to Catch Any Pokemon</h1>
        </div>
    )
}