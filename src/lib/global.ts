import { db } from "$lib/firebaseConfig.js";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { writable } from "svelte/store";
import type { Player } from "$lib/types/Player";
import type { Match } from "$lib/types/Match";
import type { Message } from "$lib/types/Message";

export const players = writable<Player[]>([]);
export const matches = writable<Match[]>([]);
export const depth = writable(5);
export const messages = writable<Message[]>([]);

// Type guards for validation
const isValidPlayer = (obj: any): obj is Player => {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    obj.info !== undefined;
};

const isValidMatch = (obj: any): obj is Match => {
  return obj &&
    typeof obj === 'object' &&
    (typeof obj.id === 'string' || typeof obj.id === 'number') && // Accept both string and number IDs
    Array.isArray(obj.items) &&
    typeof obj.winner === 'number';
};

const isValidMessage = (obj: any): obj is Message => {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.subtitle === 'string' &&
    typeof obj.date === 'string';
};

// Load messages from Firebase
export async function loadMessages(): Promise<void> {
  try {
    console.log('Loading messages from Firebase...');
    
    const messagesSnap = await getDoc(doc(db, "global", "messages"));
    
    if (!messagesSnap.exists()) {
      console.warn('Messages document not found');
      messages.set([]);
      return;
    }

    const messagesData = messagesSnap.data() ?? {};
    
    // Transform Firebase map to array
    const messageValues = Object.values(messagesData);
    const validMessages = messageValues
      .filter(isValidMessage)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
    
    messages.set(validMessages);
    
    console.log(`Loaded ${validMessages.length} messages`);
    
  } catch (error) {
    console.error('Failed to load messages:', error);
    messages.set([]);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error loading messages';
    
    throw new Error(`Failed to load messages: ${errorMessage}`);
  }
}

loadMessages()

export async function loadGame(gameId: string): Promise<void> {
  // Input validation
  if (!gameId || typeof gameId !== 'string' || gameId.trim() === '') {
    throw new Error('Game ID is required and must be a non-empty string');
  }

  try {
    // Fetch all documents concurrently
    const [pSnap, mSnap, metaSnap] = await Promise.all([
      getDoc(doc(db, gameId, "players")),
      getDoc(doc(db, gameId, "matches")),
      getDoc(doc(db, gameId, "meta"))
    ]);

    // Check if critical documents exist
    if (!pSnap.exists()) {
      throw new Error(`Players document not found for game: ${gameId}`);
    }
    
    if (!mSnap.exists()) {
      throw new Error(`Matches document not found for game: ${gameId}`);
    }

    // Get raw data with fallbacks
    const pData = pSnap.data() ?? {};
    const mData = mSnap.data() ?? {};
    const metaData = metaSnap.exists() ? metaSnap.data() : {};
    
    console.log('Raw Firebase mData:', mData);
    console.log('mData type:', typeof mData);
    console.log('mData keys:', Object.keys(mData));

    // Transform Firebase map structure to arrays
    const transformFirebaseMap = (data: any): any[] => {
      if (!data || typeof data !== 'object') return [];
      
      const values = Object.values(data);
      
      // Check if this is a nested structure (like players: {"1": {"1": playerData}})
      // vs flat structure (like matches: {"0": matchData})
      if (values.length > 0 && values[0] && typeof values[0] === 'object' && !Array.isArray(values[0])) {
        const firstValue = values[0];
        const firstValueKeys = Object.keys(firstValue);
        
        // If the first level contains objects that themselves contain the data we want
        // (checking if nested object has expected data structure properties)
        const isNestedStructure = firstValueKeys.some(key => {
          const nestedItem = firstValue[key];
          return nestedItem && typeof nestedItem === 'object' && 
                 ('id' in nestedItem || 'name' in nestedItem || 'items' in nestedItem);
        });
        
        if (isNestedStructure) {
          // Extract from nested structure: {"1": {"1": actualData}} -> [actualData]
          return values.flatMap(item => 
            item && typeof item === 'object' ? Object.values(item) : []
          );
        }
      }
      
      // Return flat structure: {"0": actualData} -> [actualData]
      return values;
    };

    // Transform and validate players
    const playerValues = transformFirebaseMap(pData);
    const validPlayers = playerValues
      .filter(isValidPlayer)
      .map(player => ({
        ...player,
        info: player.info || {} // Ensure info is never undefined
      }));

    // Transform and validate matches  
    const matchValues = transformFirebaseMap(mData);
    console.log('Raw match values before filtering:', matchValues);
    const validMatches = matchValues.filter(isValidMatch);
    console.log('Valid matches after filtering:', validMatches);

    // Extract and validate depth
    const gameDepth = metaData?.config?.depth;
    const finalDepth = (typeof gameDepth === 'number' && gameDepth >= 1) 
      ? gameDepth 
      : 5; // fallback to default

    // Update stores
    players.set(validPlayers);
    matches.set(validMatches);
    depth.set(finalDepth);

    // Log success with useful info
    console.log(`Game ${gameId} loaded:`, {
      players: validPlayers,
      matches: validMatches,
      depth: finalDepth
    });

  } catch (error) {
    console.error('Failed to load game:', error);
    
    // Clear stores on error to prevent stale data
    players.set([]);
    matches.set([]);
    depth.set(5);
    
    // Re-throw with better error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error loading game data';
    
    throw new Error(`Failed to load game ${gameId}: ${errorMessage}`);
  }
}
import { get } from 'svelte/store';

export async function pushGame(gameId: string): Promise<void> {
  // Input validation
  if (!gameId || typeof gameId !== 'string' || gameId.trim() === '') {
    throw new Error('Game ID is required and must be a non-empty string');
  }

  const currentPlayers = get(players);
  const currentMatches = get(matches);
  const currentDepth = get(depth);

  try {
    console.log(`Saving game: ${gameId}`);

    // Transform players array to Firebase map structure
    const playersMap = currentPlayers.reduce((acc, player) => {
      // Create nested structure to match your Firebase format: {"1": {"1": playerData}}
      acc[player.id] = { [player.id]: player };
      return acc;
    }, {} as Record<string, any>);

    // Transform matches array to Firebase map structure  
    const matchesMap = currentMatches.reduce((acc, match, index) => {
      // Convert Match class instance to plain object
      const plainMatch = {
        id: match.id,
        items: match.items.map(item => ({
          id: item.id,
          player_id: item.player_id
        })),
        winner: match.winner
      };
      
      // Use index as key for flat structure: {"0": matchData}
      acc[index] = plainMatch;
      return acc;
    }, {} as Record<string, any>);

    // Create meta document with game configuration
    const metaData = {
      config: {
        depth: currentDepth
      },
      lastUpdated: new Date().toISOString(),
      playersCount: currentPlayers.length,
      matchesCount: currentMatches.length
    };

    // Save all documents concurrently
    await Promise.all([
      setDoc(doc(db, gameId, "players"), playersMap),
      setDoc(doc(db, gameId, "matches"), matchesMap),
      setDoc(doc(db, gameId, "meta"), metaData)
    ]);

    console.log(`Game ${gameId} saved successfully:`, {
      players: currentPlayers.length,
      matches: currentMatches.length,
      depth: currentDepth
    });

  } catch (error) {
    console.error('Failed to save game:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error saving game data';
    
    throw new Error(`Failed to save game ${gameId}: ${errorMessage}`);
  }
}

export async function pushMessage(message: Message): Promise<void> {
  try {
    console.log('Saving message to Firebase:', message);
    
    // Get current messages data
    const messagesSnap = await getDoc(doc(db, "global", "messages"));
    const currentMessages = messagesSnap.exists() ? messagesSnap.data() : {};
    
    // Add new message using its ID as key
    const updatedMessages = {
      ...currentMessages,
      [message.id]: message
    };
    
    // Save back to Firebase
    await setDoc(doc(db, "global", "messages"), updatedMessages);
    
    console.log('Message saved successfully');
    
  } catch (error) {
    console.error('Failed to save message:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error saving message';
    
    throw new Error(`Failed to save message: ${errorMessage}`);
  }
}