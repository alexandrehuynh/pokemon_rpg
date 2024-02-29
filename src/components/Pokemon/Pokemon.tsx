import * as _React  from 'react'; 
import { useState, useEffect } from 'react'; 
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
    Alert 
} from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';

// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { SafariZoneProps } from '../../customHooks';
import { safariStyles } from '../SafariZone';
import { serverCalls } from '../../api';
import { MessageType } from '../Auth'; 


export const Pokemon = () => {
//   setup our hooks
    const db = getDatabase();
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const [ currentTeam, setCurrentTeam ] = useState<SafariZoneProps[]>()
    const userId = localStorage.getItem('uuid')
    const teamRef = ref(db, `teams/${userId}/`); 


    // useEffect to monitor changes to our team in our database
    // takes in 2 arguments, 1st is function to run, 2nd is variable we are monitoring 
    useEffect(()=> {


        // onValue() is listening for changes on team
        onValue(teamRef, (snapshot) => {
            const data = snapshot.val() //grabbing our team data from the database

            // whats coming back from the database is essentially a dictionary/object
            // we want our ddata to be a list of objects so we can forloop/map over them
            let teamList = []

            if (data){
                for (let [key, value] of Object.entries(data)){
                    let teamItem = value as SafariZoneProps
                    teamItem['poke_id'] = key
                    teamList.push(teamItem)
                }
            }

            setCurrentTeam(teamList as SafariZoneProps[])
        })

        // using the off to detach the listener (aka its basically refreshing the listener)
        return () => {
            off(teamRef)
        }
    },[]);


    // function to update Pokemon on team
    const updateTeam = async (teamItem: SafariZoneProps) => {
        const itemRef = ref(db, `teams/${userId}/${teamItem.poke_id}`);
    
        // Here, instead of quantity, you might update a 'favorite' status.
        // The actual properties will depend on what attributes of a Pokémon you want to be mutable.
        update(itemRef, {
            favorite: teamItem.favorite // Assuming 'favorite' is a boolean property of SafariZoneProps
        })
        .then(() => {
            setMessage('Successfully Updated Your Team');
            setMessageType('success');
            setOpen(true);
        })
        .catch((error) => {
            setMessage(error.message);
            setMessageType('error');
            setOpen(true);
        });
    };

    // function to release Pokemon from our Team
    const releasePokemon = async (teamItem: SafariZoneProps ) => {

        const itemRef = ref(db, `teams/${userId}/${teamItem.poke_id}`)


        // use the update() from our database to update a specific team pokemon
        remove(itemRef)
        .then(() => {
            setMessage('Successfully Released Pokemon from Team')
            setMessageType('success')
            setOpen(true)
        })
        .then(() => {
            setTimeout(() => window.location.reload(), 2000)
        })
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }

    return (
        <Box sx={safariStyles.main}>
            <NavBar />
            <Stack direction = 'column' sx={safariStyles.main}>
                <Stack direction = 'row' alignItems = 'center' sx={{marginTop: '100px', marginLeft: '200px'}}>
                    <Typography 
                        variant = 'h4'
                        sx = {{ marginRight: '20px'}}
                    >
                        Your Team
                    </Typography>
                    <Button color = 'primary' variant = 'contained' onClick={()=>{}} >Checkout 🎄</Button>
                </Stack>
                <Grid container spacing={3} sx={safariStyles.grid}>
                    {currentTeam?.map((team: SafariZoneProps, index: number) => (
                        <Grid item key={index} xs={12} md={6} lg={4}>
                            <Card sx={safariStyles.card}>
                                <CardMedia 
                                    component = 'img'
                                    sx = {safariStyles.cardMedia}
                                    image = {team.image_url}
                                    alt = {team.pokemon_name}
                                />
                                <CardContent>
                                    <Stack direction='column' justifyContent='space-between' alignItems='center'>
                                        <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                                            <AccordionSummary expandIcon={<InfoIcon sx={{ color: theme.palette.primary.main }}/>}>
                                                <Typography>{team.pokemon_name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>Type: {team.type}</Typography>
                                                <Typography>Abilities: {team.abilities}</Typography>
                                                <Typography>Moves: {team.moves}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        {/* If you have functionality for editing team member details, keep this button */}
                                        <Button 
                                            size='medium'
                                            variant='outlined'
                                            sx={safariStyles.button}
                                            onClick={()=>{ updateTeam(team) }}
                                        >
                                            Edit Details
                                        </Button>
                                        <Button 
                                            size='medium'
                                            variant='outlined'
                                            sx={safariStyles.button}
                                            onClick={()=>{releasePokemon(team)}}
                                        >
                                            Release Pokémon
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>

                        </Grid>
                    ))}
                </Grid>
            </Stack>

        </Box>
    )
}
