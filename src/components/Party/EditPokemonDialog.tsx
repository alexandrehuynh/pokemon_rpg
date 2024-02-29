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

    // Construct the new image URL based on the selection
    if (pokemon) {
      const baseImageUrl = pokemon.image_url.split('/').slice(0, -1).join('/'); // Remove the last segment (shiny or not)
      const newImageUrl = `${baseImageUrl}/${newSpriteType === 'shiny' ? 'shiny' : 'default'}.png`;
      setImageUrl(newImageUrl);
    }
  };

  const handleSave = () => {
    if (pokemon) {
      const updatedPokemon: SafariZoneProps = {
        ...pokemon,
        image_url: imageUrl,
      };
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
        <Button onClick={handleSave} color="primary" variant="contained" sx={{ marginTop: '20px' }}>
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
