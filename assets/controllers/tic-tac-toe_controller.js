import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['cell', 'status', 'userScore', 'systemScore', 'tiesScore', 'difficulty', 'startingPlayer'];

    connect() {
        this.scores = {
            user: 0,
            system: 0,
            ties: 0
        };
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X'; // X is User, O is System
        this.gameActive = true;

        // Load initial state
        this.updateScoreboard();
        this.startNewGame();
    }

    startNewGame() {
        this.board = Array(9).fill(null);
        this.gameActive = true;

        // Determine starting player
        const starter = this.startingPlayerTarget.value;
        this.currentPlayer = starter === 'user' ? 'X' : 'O';

        // Clear cells
        this.cellTargets.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('bg-indigo-950/40', 'border-cyan-500/40', 'border-rose-500/40', 'bg-rose-950/20', 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', 'shadow-[0_0_15px_rgba(244,63,94,0.15)]');
            cell.classList.add('tic-tac-cell');
            cell.removeAttribute('disabled');
        });

        this.updateStatus();

        if (this.currentPlayer === 'O') {
            this.disableBoard();
            setTimeout(() => this.systemMove(), 600);
        } else {
            this.enableBoard();
        }
    }

    // Called when user clicks a cell
    makeMove(event) {
        if (!this.gameActive || this.currentPlayer !== 'X') return;

        const cell = event.currentTarget;
        const index = parseInt(cell.dataset.index);

        if (this.board[index] !== null) return;

        this.placeSymbol(index, 'X');

        if (this.checkGameEnd()) return;

        // Switch to System
        this.currentPlayer = 'O';
        this.updateStatus();
        this.disableBoard();

        // System plays after short delay
        setTimeout(() => this.systemMove(), 700);
    }

    systemMove() {
        if (!this.gameActive) return;

        const availableMoves = this.board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (availableMoves.length === 0) return;

        const difficulty = this.difficultyTarget.value;
        let chosenMove;

        if (difficulty === 'easy') {
            // Easy: completely random move
            const randomIdx = Math.floor(Math.random() * availableMoves.length);
            chosenMove = availableMoves[randomIdx];
        } else {
            // Smart: Unbeatable Minimax
            chosenMove = this.findBestMove();
        }

        this.placeSymbol(chosenMove, 'O');

        if (this.checkGameEnd()) return;

        // Switch to User
        this.currentPlayer = 'X';
        this.updateStatus();
        this.enableBoard();
    }

    placeSymbol(index, player) {
        this.board[index] = player;
        const cell = this.cellTargets.find(c => parseInt(c.dataset.index) === index);

        if (!cell) return;

        // Animate cell styling
        cell.classList.remove('tic-tac-cell');

        if (player === 'X') {
            cell.classList.add('bg-indigo-950/60', 'border-cyan-400/70', 'shadow-[0_0_20px_rgba(34,211,238,0.28)]');
            cell.innerHTML = `
                <svg class="w-12 h-12 text-cyan-400 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" class="draw-line"></line>
                    <line x1="6" y1="6" x2="18" y2="18" class="draw-line-delayed"></line>
                </svg>
            `;
        } else {
            cell.classList.add('bg-rose-950/30', 'border-rose-400/70', 'shadow-[0_0_20px_rgba(244,63,94,0.28)]');
            cell.innerHTML = `
                <svg class="w-12 h-12 text-rose-500 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round">
                    <circle cx="12" cy="12" r="9" class="draw-circle"></circle>
                </svg>
            `;
        }
        cell.setAttribute('disabled', 'true');
    }

    disableBoard() {
        this.cellTargets.forEach(cell => {
            if (this.board[parseInt(cell.dataset.index)] === null) {
                cell.setAttribute('disabled', 'true');
                cell.classList.add('cursor-not-allowed');
            }
        });
    }

    enableBoard() {
        this.cellTargets.forEach(cell => {
            if (this.board[parseInt(cell.dataset.index)] === null) {
                cell.removeAttribute('disabled');
                cell.classList.remove('cursor-not-allowed');
            }
        });
    }

    checkGameEnd() {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const line of winningLines) {
            const [a, b, c] = line;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.endGame(this.board[a], line);
                return true;
            }
        }

        // Check Draw
        if (this.board.every(cell => cell !== null)) {
            this.endGame('draw');
            return true;
        }

        return false;
    }

    endGame(result, winningLine = null) {
        this.gameActive = false;
        this.disableBoard();

        if (result === 'draw') {
            this.scores.ties++;
            this.statusTarget.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-yellow-400 animate-pulse">
                    <span>🤝</span>
                    <span class="font-bold tracking-wide">Match Nul !</span>
                </div>
            `;
        } else if (result === 'X') {
            this.scores.user++;
            this.statusTarget.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-cyan-400 animate-bounce">
                    <span>🎉</span>
                    <span class="font-bold tracking-wide">Victoire ! Félicitations !</span>
                </div>
            `;
            if (winningLine) this.highlightWinner(winningLine, 'X');
        } else {
            this.scores.system++;
            this.statusTarget.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-rose-500 animate-pulse">
                    <span>🤖</span>
                    <span class="font-bold tracking-wide">Le système a gagné !</span>
                </div>
            `;
            if (winningLine) this.highlightWinner(winningLine, 'O');
        }

        this.updateScoreboard();
    }

    highlightWinner(line, player) {
        const borderClass = player === 'X' ? 'border-cyan-400 bg-cyan-950/20' : 'border-rose-400 bg-rose-950/40';
        const pulseClass = 'animate-pulse scale-105 transition-all duration-300';

        line.forEach(index => {
            const cell = this.cellTargets.find(c => parseInt(c.dataset.index) === index);
            if (cell) {
                cell.className = `w-full aspect-square flex items-center justify-center rounded-2xl border-2 cursor-default ${borderClass} ${pulseClass}`;
            }
        });
    }

    updateScoreboard() {
        this.userScoreTarget.textContent = this.scores.user;
        this.systemScoreTarget.textContent = this.scores.system;
        this.tiesScoreTarget.textContent = this.scores.ties;
    }

    updateStatus() {
        if (this.currentPlayer === 'X') {
            this.statusTarget.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-cyan-300">
                    <span class="relative flex h-2.5 w-2.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                    </span>
                    <span>C'est votre tour</span>
                </div>
            `;
        } else {
            this.statusTarget.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-rose-400">
                    <span class="relative flex h-2.5 w-2.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span class="animate-pulse">Le système réfléchit...</span>
                </div>
            `;
        }
    }

    // --- Minimax Logic ---
    findBestMove() {
        let bestVal = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                // Make move
                this.board[i] = 'O';

                // Evaluate move
                let moveVal = this.minimax(0, false);

                // Undo move
                this.board[i] = null;

                if (moveVal > bestVal) {
                    bestVal = moveVal;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    minimax(depth, isMax) {
        let score = this.evaluateBoard();

        // If Maximizer has won the game return evaluated score
        if (score === 10) return score - depth;

        // If Minimizer has won the game return evaluated score
        if (score === -10) return score + depth;

        // If there are no more moves and no winner, it's a draw
        if (!this.board.includes(null)) return 0;

        if (isMax) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'O';
                    best = Math.max(best, this.minimax(depth + 1, false));
                    this.board[i] = null;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'X';
                    best = Math.min(best, this.minimax(depth + 1, true));
                    this.board[i] = null;
                }
            }
            return best;
        }
    }

    evaluateBoard() {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const line of winningLines) {
            const [a, b, c] = line;
            if (this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
                if (this.board[a] === 'O') return 10;
                if (this.board[a] === 'X') return -10;
            }
        }
        return 0;
    }
}
