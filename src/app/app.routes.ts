import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./dashboard/dashboard')
                .then(m => m.Dashboard)
    },
    {
        path: 'hanoi',
        loadComponent: () =>
            import('./hanoi/hanoi')
                .then(m => m.Hanoi)
    },
    {
        path: 'tictactoe',
        loadComponent: () =>
            import('./tictactoe/tictactoe')
                .then(m => m.Tictactoe)
    },
    {
        path: 'snake',
        loadComponent: () =>
            import('./snake/snake')
                .then(m => m.Snake)
    },
    {
        path: 'puzzle',
        loadComponent: () =>
            import('./puzzle/puzzle')
                .then(m => m.Puzzle)
    },
    {
        path: 'number-guess',
        loadComponent: () =>
            import('./number-guess/number-guess')
                .then(m => m.NumberGuess)
    },
    {
        path: 'puzzle-2048',
        loadComponent: () =>
            import('./puzzle-2048/puzzle-2048')
                .then(m => m.Puzzle2048)
    },
    // {
    //     path: 'flappy-bird',
    //     loadComponent: () =>
    //         import('./flappy-bird/flappy-bird')
    //             .then(m => m.FlappyBird)
    // },
    {
        path: 'memory-card',
        loadComponent: () =>
            import('./memory-card/memory-card')
                .then(m => m.MemoryCard )
    },
    {
        path: 'minesweeper',
        loadComponent: () =>
            import('./minesweeper/minesweeper')
                .then(m => m.Minesweeper)
    },
    {
        path: 'brick-breaker',
        loadComponent: () =>
            import('./brick-breaker/brick-breaker')
                .then(m => m.BrickBreaker)
    },
    {
        path: 'sudoku',
        loadComponent: () =>
            import('./sudoku/sudoku')
                .then(m => m.Sudoku)
    },
    {
        path: 'connect-four',
        loadComponent: () =>
            import('./connect-four/connect-four')
                .then(m => m.ConnectFour)
    },
    {
        path: 'water-sort',
        loadComponent: () =>
            import('./water-sort/water-sort')
                .then(m => m.WaterSort)
    },
    {
        path: 'typing-test',
        loadComponent: () =>
            import('./typing-test/typing-test')
                .then(m => m.TypingTest)
    },
    {
        path: 'word-search',
        loadComponent: () =>
            import('./word-search/word-search')
                .then(m => m.WordSearch)
    },
    {
        path: 'quick-math',
        loadComponent: () =>
            import('./quick-math/quick-math')
                .then(m => m.QuickMath)
    },
    {
        path: 'space-shooter',
        loadComponent: () =>
            import('./space-shooter/space-shooter')
                .then(m => m.SpaceShooter)
    },
    // {
    //     path: 'car-racing',
    //     loadComponent: () =>
    //         import('./car-racing/car-racing')
    //             .then(m => m.CarRacing)
    // },
    {
        path: '**',
        redirectTo: ''
    }
];
