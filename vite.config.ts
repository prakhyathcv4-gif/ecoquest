import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          ecoChallenges: path.resolve(__dirname, 'eco-challenges.html'),
          ecoTips: path.resolve(__dirname, 'eco-tips.html'),
          wasteManagement: path.resolve(__dirname, 'waste-management.html'),
          waterSaving: path.resolve(__dirname, 'water-saving.html'),
          energySaving: path.resolve(__dirname, 'energy-saving.html'),
          greenFood: path.resolve(__dirname, 'green-food.html'),
          greenTravel: path.resolve(__dirname, 'green-travel.html'),
          upcycling: path.resolve(__dirname, 'upcycling.html'),
          ecoCalculator: path.resolve(__dirname, 'eco-calculator.html'),
          ecoQuiz: path.resolve(__dirname, 'eco-quiz.html'),
          leaderboard: path.resolve(__dirname, 'leaderboard.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
