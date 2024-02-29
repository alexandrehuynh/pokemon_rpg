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
import { EditPokemonDialog } from './EditPokemonDialog';



export const Party = () => {
    const db = getDatabase();
    const userId = localStorage.getItem('uuid'); // Ensure this is correctly implemented to fetch user's ID
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<MessageType | undefined>(undefined);
    const [currentTeam, setCurrentTeam] = useState<SafariZoneProps[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<SafariZoneProps | null>(null);
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
                  teamItem['firebaseKey'] = key
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
  
    const handleEditClick = (pokemon: SafariZoneProps) => {
      setSelectedPokemon(pokemon);
      setEditDialogOpen(true);
    };
  
    const handleSaveChanges = async (updatedPokemon: SafariZoneProps) => {
      console.log('handleSaveChanges called with:', updatedPokemon); // This should include firebaseKey
      if (!updatedPokemon.firebaseKey) {
        console.log('No firebaseKey present, returning early.');
        return; // If this is logged, you have an issue with the firebaseKey being passed down
      }  
      const itemRef = ref(db, `teams/${userId}/${updatedPokemon.firebaseKey}`);
      console.log('itemRef:', itemRef)
      try {
        const updateData = { ...updatedPokemon };
        delete updateData.firebaseKey; // Remove firebaseKey from the update data
    
        await update(itemRef, updateData);
        console.log('update being called with:', itemRef, 'and', updateData);
        // Fetch updated list of Pokémon
        fetchUpdatedTeam();
        setMessage('Successfully Updated Your Team');
        setMessageType('success');
      } catch (error) {
        console.error(error);
        setMessage('An error occurred while updating your team.');
        setMessageType('error');
      } finally {
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
        setEditDialogOpen(false);
      }
    };
    
    
    const fetchUpdatedTeam = () => {
      onValue(teamRef, (snapshot) => {
        const data = snapshot.val();
        const teamList = data ? Object.entries(data).map(([key, value]) => ({
          ...(value as SafariZoneProps),
          firebaseKey: key  // Include the unique key
        })) : [];
        setCurrentTeam(teamList);
      }, {
          onlyOnce: true // This ensures the listener is called only once and then detached.
      });
    };    

  // function to release Pokemon from our Team
  const releasePokemon = async (teamItem: SafariZoneProps) => {
    // You need to find the unique key for the Pokémon to be deleted
    onValue(teamRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            // Check if this is the Pokémon to delete
            if (childData.poke_id === teamItem.poke_id) {
                // Perform the delete operation using the unique key
                const itemRef = ref(db, `teams/${userId}/${childKey}`);
                remove(itemRef)
                    .then(() => {
                        console.log(`Successfully removed Pokémon with poke_id: ${teamItem.poke_id} from the database.`);
                        // ... rest of your code to update state and UI
                    })
                    .catch((error) => {
                        console.error("Error removing Pokémon: ", error);
                        // ... handle errors
                    });
            }
        });
    }, {
        onlyOnce: true // Use this to ensure the listener is detached after the operation
    });
};

      
      
        return (
            <Box sx={safariStyles.main}>
              <NavBar />
              <Stack direction="column" sx={safariStyles.main}>
                <Stack direction="row" alignItems="center" sx={{ marginTop: '100px', marginLeft: '200px' }}>
                  <Typography variant="h4" sx={{ marginRight: '20px' }}>
                    Your Team
                  </Typography>
                  <Button color="primary" variant="contained" onClick={() => { /* Implement checkout functionality */ }}>Checkout 🎄</Button>
                </Stack>
                <Grid container spacing={3} sx={safariStyles.grid}>
                  {currentTeam.map((team: SafariZoneProps, index: number) => (
                    <Grid item key={index} xs={12} md={6} lg={4}>
                      <Card sx={safariStyles.card}>
                        <CardMedia
                          component="img"
                          sx={safariStyles.cardMedia}
                          image={team.image_url}
                          alt={team.pokemon_name}
                        />
                        <CardContent>
                          <Stack direction="column" justifyContent="space-between" alignItems="center">
                            <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                              <AccordionSummary expandIcon={<InfoIcon sx={{ color: theme.palette.primary.main }} />}>
                                <Typography>{team.pokemon_name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography>Type: {team.type}</Typography>
                                <Typography>Abilities: {team.abilities}</Typography>
                                {/* <Typography>Moves: {team.moves}</Typography> */}
                              </AccordionDetails>
                            </Accordion>
                            <Button
                              size="medium"
                              variant="outlined"
                              sx={safariStyles.button}
                              onClick={() => handleEditClick(team)}
                            >
                              Edit Details
                            </Button>
                            <Button
                              size="medium"
                              variant="outlined"
                              sx={safariStyles.button}
                              onClick={() => releasePokemon(team)}
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
              {selectedPokemon && (
                <EditPokemonDialog
                  open={editDialogOpen}
                  pokemon={selectedPokemon}
                  onClose={() => setEditDialogOpen(false)}
                  onSave={handleSaveChanges}
                />
              )}
              <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity={messageType} sx={{ width: '100%' }}>
                  {message}
                </Alert>
              </Snackbar>
            </Box>
          );
};