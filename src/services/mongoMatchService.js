/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: MongoDB Match History Service
 */

import { getMatchesCollection } from '../config/mongodb.js';

/**
 * Initialize match history with sample data
 */
export async function initializeMatchHistory() {
  try {
    const matches = await getMatchesCollection();
    const count = await matches.countDocuments();
    
    if (count === 0) {
      await matches.insertMany([
        {
          playerUserId: 1,
          playerName: 'Phạm Việt Hoàng',
          gameMode: 'PvA',
          opponentName: 'AI Minimax',
          playerScore: 45,
          opponentScore: 30,
          result: 'win',
          playedAt: new Date('2025-12-03T14:30:00'),
        },
        {
          playerUserId: 2,
          playerName: 'Nguyễn Thái Hòa',
          gameMode: 'PvA',
          opponentName: 'AI Minimax',
          playerScore: 38,
          opponentScore: 42,
          result: 'loss',
          playedAt: new Date('2025-12-03T15:20:00'),
        },
        {
          playerUserId: 1,
          playerName: 'Phạm Việt Hoàng',
          gameMode: 'PvP',
          opponentName: 'Nguyễn Thái Hòa',
          playerScore: 40,
          opponentScore: 40,
          result: 'draw',
          playedAt: new Date('2025-12-03T16:00:00'),
        },
        {
          playerUserId: 3,
          playerName: 'Nguyễn Ngọc Phi',
          gameMode: 'PvA',
          opponentName: 'AI Minimax',
          playerScore: 50,
          opponentScore: 35,
          result: 'win',
          playedAt: new Date('2025-12-04T10:15:00'),
        },
        {
          playerUserId: 2,
          playerName: 'Nguyễn Thái Hòa',
          gameMode: 'PvP',
          opponentName: 'Nguyễn Ngọc Phi',
          playerScore: 35,
          opponentScore: 38,
          result: 'loss',
          playedAt: new Date('2025-12-04T11:30:00'),
        },
      ]);
      
      console.log('✅ Match history initialized');
    }
  } catch (error) {
    console.error('❌ Init matches error:', error);
  }
}

/**
 * Get all matches (sorted by date, newest first)
 */
export async function getAllMatches() {
  try {
    const matches = await getMatchesCollection();
    return await matches.find().sort({ playedAt: -1 }).toArray();
  } catch (error) {
    console.error('Get matches error:', error);
    return [];
  }
}

/**
 * Get matches by user ID
 */
export async function getMatchesByUserId(userId) {
  try {
    const matches = await getMatchesCollection();
    return await matches
      .find({ playerUserId: userId })
      .sort({ playedAt: -1 })
      .toArray();
  } catch (error) {
    console.error('Get user matches error:', error);
    return [];
  }
}

/**
 * Save new match
 */
export async function saveMatch(matchData) {
  try {
    const matches = await getMatchesCollection();
    
    const newMatch = {
      ...matchData,
      playedAt: new Date(),
    };
    
    const result = await matches.insertOne(newMatch);
    
    return {
      ...newMatch,
      matchId: result.insertedId,
    };
  } catch (error) {
    console.error('Save match error:', error);
    return null;
  }
}

/**
 * Get match statistics
 */
export async function getMatchStats() {
  try {
    const matches = await getMatchesCollection();
    const allMatches = await matches.find().toArray();
    
    return {
      totalMatches: allMatches.length,
      pvpMatches: allMatches.filter(m => m.gameMode === 'PvP').length,
      pvaMatches: allMatches.filter(m => m.gameMode === 'PvA').length,
      avaMatches: allMatches.filter(m => m.gameMode === 'AvA').length,
    };
  } catch (error) {
    console.error('Get stats error:', error);
    return {
      totalMatches: 0,
      pvpMatches: 0,
      pvaMatches: 0,
      avaMatches: 0,
    };
  }
}
