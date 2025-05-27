import { useState } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRoom = async (roomCode, gameData) => {
    setLoading(true);
    setError(null);
    
    try {
      const roomRef = doc(db, 'gameRooms', roomCode);
      
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        throw new Error('Room code already exists');
      }
      
      await setDoc(roomRef, {
        ...gameData,
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp()
      });
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  const joinRoom = async (roomCode, playerData) => {
    setLoading(true);
    setError(null);
    
    try {
      const roomRef = doc(db, 'gameRooms', roomCode);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) {
        throw new Error('Room not found');
      }
      
      const roomData = roomSnap.data();
      
      if (roomData.players.length >= roomData.settings.maxPlayers) {
        throw new Error('Room is full');
      }
      
      const existingPlayerIndex = roomData.players.findIndex(p => p.id === playerData.id);
      
      if (existingPlayerIndex >= 0) {
        // Player rejoining
        const updatedPlayers = [...roomData.players];
        updatedPlayers[existingPlayerIndex].isConnected = true;
        
        await updateDoc(roomRef, {
          players: updatedPlayers,
          lastActivity: serverTimestamp()
        });
      } else {
        // New player
        await updateDoc(roomRef, {
          players: arrayUnion(playerData),
          lastActivity: serverTimestamp()
        });
      }
      
      setLoading(false);
      return { id: roomCode, ...roomData };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Update room data
  const updateRoom = async (roomCode, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const roomRef = doc(db, 'gameRooms', roomCode);
      await updateDoc(roomRef, {
        ...updates,
        lastActivity: serverTimestamp()
      });
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Add a guess to current round
  const addGuess = async (roomCode, guess) => {
    setLoading(true);
    setError(null);
    
    try {
      const roomRef = doc(db, 'gameRooms', roomCode);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) {
        throw new Error('Room not found');
      }
      
      const roomData = roomSnap.data();
      const updatedRound = {
        ...roomData.currentRound,
        guesses: [...(roomData.currentRound.guesses || []), guess]
      };
      
      await updateDoc(roomRef, {
        currentRound: updatedRound,
        lastActivity: serverTimestamp()
      });
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Update player connection status
  const updatePlayerConnection = async (roomCode, playerId, isConnected) => {
    setLoading(true);
    setError(null);
    
    try {
      const roomRef = doc(db, 'gameRooms', roomCode);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) {
        throw new Error('Room not found');
      }
      
      const roomData = roomSnap.data();
      const updatedPlayers = roomData.players.map(player => 
        player.id === playerId 
          ? { ...player, isConnected }
          : player
      );
      
      await updateDoc(roomRef, {
        players: updatedPlayers,
        lastActivity: serverTimestamp()
      });
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Delete room
  const deleteRoom = async (roomCode) => {
    setLoading(true);
    setError(null);
    
    try {
      const roomRef = doc(db, 'gameRooms', roomCode);
      await deleteDoc(roomRef);
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Subscribe to real-time room updates
  const subscribeToRoom = (roomCode, callback) => {
    const roomRef = doc(db, 'gameRooms', roomCode);
    
    return onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      setError(error.message);
    });
  };

  return {
    loading,
    error,
    createRoom,
    joinRoom,
    updateRoom,
    addGuess,
    updatePlayerConnection,
    deleteRoom,
    subscribeToRoom
  };
}