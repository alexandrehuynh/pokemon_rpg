import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, FormControl, InputLabel, Select, MenuItem, TextField, Button, SelectChangeEvent } from '@mui/material';
import { SafariZoneProps } from '../../customHooks';

interface EditPokemonDialogProps {
  open: boolean;
  pokemon: SafariZoneProps | null;
  onClose: () => void;
  onSave: (pokemon: SafariZoneProps) => void;
}

export const EditPokemonDialog: React.FC<EditPokemonDialogProps> = ({
  open,
  pokemon,
  onClose,
  onSave,
}) => {
  const [spriteType, setSpriteType] = useState<'default' | 'shiny'>('default');
  const [imageUrl, setImageUrl] = useState('');

  // Effect to check the sprite type based on the image URL
  useEffect(() => {
    if (pokemon?.image_url) {
      const isShiny = pokemon.image_url.includes('/shiny/');
      setSpriteType(isShiny ? 'shiny' : 'default');
      setImageUrl(pokemon.image_url); // Set the current image URL
    }
  }, [pokemon]);

  const handleSpriteTypeChange = (event: SelectChangeEvent<'default' | 'shiny'>) => {
    const newSpriteType = event.target.value as 'default' | 'shiny';
    setSpriteType(newSpriteType);
  
    if (pokemon) {
      let newImageUrl = pokemon.image_url;
      const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/';
      const pokemonId = pokemon.image_url.split('/').pop(); // Get the Pokémon ID from the URL
  
      if (newSpriteType === 'shiny') {
        // If the new type is shiny, add /shiny/ to the URL if it's not already there
        if (!newImageUrl.includes('/shiny/')) {
          newImageUrl = `${baseUrl}shiny/${pokemonId}`;
        }
      } else {
        // If the new type is default, remove /shiny/ from the URL if it's there
        newImageUrl = newImageUrl.replace('/shiny/', '/');
      }
  
      setImageUrl(newImageUrl);
    }
  };


  const handleSave = () => {
    console.log('About to save, pokemon:', pokemon); // Log the pokemon before saving
    if (pokemon) {
      const updatedPokemon: SafariZoneProps = {
        ...pokemon,
        image_url: imageUrl, // Assuming image_url is the only property being updated
      };
      console.log('Saving with firebaseKey:', updatedPokemon.firebaseKey); // Confirm the firebaseKey is present
      onSave(updatedPokemon);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="sprite-type-label">Sprite Type</InputLabel>
          <Select
            labelId="sprite-type-label"
            value={spriteType}
            onChange={handleSpriteTypeChange}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="shiny">Shiny</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          label="Image URL"
          fullWidth
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          // Removed the disabled attribute to allow manual URL editing if desired
        />
        <Button onClick={handleSave} type = "button" color="primary" variant="contained" sx={{ marginTop: '20px' }}>
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
