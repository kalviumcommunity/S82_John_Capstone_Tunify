import React from 'react';
import { Home } from './Home';

function PlayerContainer({ onSongClick }) {
  return (
    <>
      <Home onSongClick={onSongClick} />
    </>
  );
}

export { PlayerContainer };
