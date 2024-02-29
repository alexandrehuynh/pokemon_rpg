import * as _React from 'react'; 
// import React from 'react'; 
import { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography,
    Snackbar,
    Alert } from '@mui/material'; 
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';   
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Grid from "@mui/material/Grid";
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getDatabase, ref, push, get, child } from 'firebase/database';


// internal imports
import { useGetSafari, SafariZoneProps } from '../../customHooks';
import { NavBar, InputText } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { MessageType } from '../Auth';

// creating our interfaces for our team & our form submit
export interface SubmitProps {

}
interface TeamProps {
    teamItem: SafariZoneProps
}

// creating our Shop CSS style object 
export const safariStyles = {
    main: {
        backgroundColor: theme.palette.secondary.main,
        height: '100%',
        width: '100%',
        color: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px'
    },
    grid: {
        marginTop: '25px', 
        marginRight: 'auto', 
        marginLeft: 'auto', 
        width: '70vw'
    },
    card: {
        width: "300px", 
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.secondary.light,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    cardMedia: {
        width: '95%',
        margin: 'auto',
        marginTop: '5px',
        aspectRatio: '1/1',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: 'white', 
        borderRadius: '50px',
        height: '45px',
        width: '250px',
        marginTop: '10px'
    },
    stack: {
        width: '75%', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    },
    stack2: {
        border: '1px solid', 
        borderColor: theme.palette.primary.main, 
        borderRadius: '50px', 
        width: '100%',
        marginTop: '10px'
    },
    typography: { 
        marginLeft: '15vw', 
        color: "white", 
        marginTop: '100px'
    }

}

const AddToTeam = (team: TeamProps ) => {
    // setup our hooks & variables
    const db = getDatabase();
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const { register, handleSubmit } = useForm<SubmitProps>({})
    let myTeam = team.teamItem 


    const onSubmit: SubmitHandler<SubmitProps> = async (data: SubmitProps, event: any) => {
        if (event) event.preventDefault();

        const userId = localStorage.getItem('uuid') //grabbing the user id from localstorage 
        const teamRef = ref(db, `teams/${userId}/`) // this is where we are pathing in our database 

        // Check if the user's team has less than 6 Pokémon before adding
        get(child(teamRef, 'team')).then((snapshot) => {
            // Directly add Pokémon without checking team size
            push(teamRef, myTeam)
                .then(() => {
                    setMessage(`Successfully added ${myTeam.pokemon_name} to Team`);
                    setMessageType('success');
                    setOpen(true);
                })
                .catch((error) => {
                    setMessage(error.message);
                    setMessageType('error');
                    setOpen(true);
                });
        }).catch((error) => {
            console.error(error);
        });
    }
    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Button type='submit'>Add to Team</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={()=> setOpen(false)}
            >
                <Alert severity={messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export const SafariZone = () => {
    // setup our hooks
    const { safariData } = useGetSafari(); //list of all our data objects 
    const [currentSafari, setCurrentSafari] = useState<SafariZoneProps | null>(null); // one and only one object we will send to our team 
    const [teamOpen, setTeamOpen] = useState(false);

    console.log(safariData);

    return (
        <Box sx={safariStyles.main}>
            <NavBar />
            <Typography variant='h4' sx={safariStyles.typography}>
            Welcome to Safari Zone: Feel Free to Catch Any Pokemon
            </Typography>
            <Grid container spacing={3} sx={safariStyles.grid}>
                {safariData.map((safari: SafariZoneProps, index: number) => (
                    <Grid item key={index} xs={12} md={6} lg={4}>
                        <Card sx={safariStyles.card}>
                            <CardMedia 
                                component='img'
                                sx={safariStyles.cardMedia}
                                image={safari.image_url}
                                alt={safari.pokemon_name}
                            />
                            <CardContent>
                                <Stack direction='column' justifyContent='space-between' alignItems='center'>
                                    <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                                        <AccordionSummary expandIcon={<CatchingPokemonIcon sx={{ transform: 'rotate(180deg)', color: theme.palette.primary.main }}/>}>
                                            <Typography>{safari.pokemon_name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>Type: {safari.type} <br /> Abilities: {safari.abilities}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Button
                                        variant='outlined'
                                        size='medium'
                                        sx={safariStyles.button}
                                        onClick={() => { setTeamOpen(true); setCurrentSafari(safari); }}
                                    >
                                        Catch {safari.pokemon_name}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={teamOpen} onClose={()=>{setTeamOpen(false)}}>
                <DialogContent>
                    <DialogContentText>Add to Team</DialogContentText>
                    <AddToTeam teamItem = {currentSafari as SafariZoneProps}/>
                </DialogContent>
            </Dialog>
        </Box>
    );
};