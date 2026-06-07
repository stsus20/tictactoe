import { BoardState } from '../types/game';

export const getInitialBoard = (): BoardState => Array(9).fill(null) as BoardState;
