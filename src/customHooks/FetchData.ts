import * as _React from 'react';
import { useState, useEffect } from 'react'; 


// internal imports
import { serverCalls } from '../api'; 



// WE are creating a custom hook to make API calls every time we go to the Shop page. 

// creaating our interfaces for our shop data & return of our hook

export interface SafariZoneProps {
    poke_id: string;
    pokemon_name: string;
    image_url: string;
    moves: string;
    type: string;
    abilities: string;
    date_added: string;
    user_id?: string;
    favorite?: boolean;
}


interface GetSafariDataProps {
    safariData: SafariZoneProps[]
    getData: () => void
}


// create our custom hook that get's called automatically when we go to our Shop page
export const useGetSafari = (): GetSafariDataProps => {
    // setup some hooks
    const [ safariData, setSafariData ] = useState<SafariZoneProps[]>([])


    const handleDataFetch = async () => {
        const result = await serverCalls.getPokemon() //making the api call from our serverCall dictionary/object

        setSafariData(result)
    }

    // useEffect is essentially an event listener listening for changes to variables 
    // takes 2 arguments, 1 is the function to run, the 2nd is the variable we are watching in a []
    useEffect(()=> {
        handleDataFetch()
    }, []) //[] inside list is variable we are watching/listening to for changes 

    return { safariData, getData: handleDataFetch }

}