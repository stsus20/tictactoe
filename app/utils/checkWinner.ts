// utils/checkWinner.ts
import { BoardState, Player } from '../types/game';

/**
 * Determina el estado actual del juego en el tablero de Tic Tac Toe.
 * @param board - Array de 9 elementos que representa el tablero (índices 0-8).
 * @returns "X" si gana X, "O" si gana O, "draw" si hay empate (tablero lleno sin ganador), null si aún no termina.
 */
export const checkWinner = (
  board: BoardState
): { winner: Player | 'draw' | null; winningLine: number[] | null } => {
  // Todas las combinaciones posibles de líneas ganadoras (filas, columnas, diagonales)
  const winningLines: number[][] = [
    [0, 1, 2], // primera fila
    [3, 4, 5], // segunda fila
    [6, 7, 8], // tercera fila
    [0, 3, 6], // primera columna
    [1, 4, 7], // segunda columna
    [2, 5, 8], // tercera columna
    [0, 4, 8], // diagonal principal
    [2, 4, 6], // diagonal secundaria
  ];

  // Recorrer cada línea ganadora para verificar si hay coincidencia de tres símbolos iguales
  for (const line of winningLines) {
    const [a, b, c] = line;
    const cellA = board[a];
    const cellB = board[b];
    const cellC = board[c];

    // Si la primera celda no es nula y las tres son iguales, hay un ganador
    if (cellA !== null && cellA === cellB && cellA === cellC) {
      return { winner: cellA as Player, winningLine: line };
    }
  }

  // Verificar si todas las celdas están ocupadas (empate)
  const isDraw = board.every((cell) => cell !== null);

  if (isDraw) {
    return { winner: 'draw', winningLine: null };
  }

  // Si no hay ganador ni empate, el juego continúa
  return { winner: null, winningLine: null };
};