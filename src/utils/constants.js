/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Game constants for O An Quan
 */

// Board Configuration
export const BOARD_SIZE = 12;
export const MINOR_BOX_COUNT = 10;
export const INITIAL_STONE_SMALL = 5;
export const INITIAL_STONE_BIG = 1;
export const BIG_STONE_VALUE = 10;

// Box Indices
export const QUAN_BOXES = [0, 6];
export const PLAYER_X_BOXES = [7, 8, 9, 10, 11];
export const PLAYER_O_BOXES = [1, 2, 3, 4, 5];
export const PLAYER_X_SCORE_INDEX = 6;
export const PLAYER_O_SCORE_INDEX = 0;

// Players
export const PLAYER_X = 'X';
export const PLAYER_O = 'O';

// AI Configuration
export const AI_PLAYER = PLAYER_O;
export const HUMAN_PLAYER = PLAYER_X;
export const AI_DEPTH = 4;

// Animation Configuration
export const SOW_ANIMATION_DELAY = 150; // ms
export const AI_MOVE_DELAY = 1000; // ms
export const HUMAN_TO_AI_DELAY = 1000; // ms

// Game Modes
export const GAME_MODE_PVP = 'PvP';
export const GAME_MODE_PVA = 'PvA';
export const GAME_MODE_AVA = 'AvA';
