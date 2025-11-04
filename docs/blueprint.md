# **App Name**: Global GoalGetters

## Core Features:

- User Authentication: Secure user login/registration with email, password and Google, managed by Firebase Authentication.
- League Creation & Joining: Automated league creation based on entry fee tiers, with users automatically assigned to leagues upon payment. Features a Firestore database.
- Daily Lineup Selection: Users select a lineup of players within a budget (salary cap) for each game day.
- Real-time Match Data Integration: Fetch player stats from a 3rd party sports API and update player values daily.
- Automated Matchups & Scoring: Automatically generate 1v1 matchups within leagues, calculate scores based on player performance, and update league standings, using Firebase Functions.
- In-game Strategy Cards: Players use strategy cards to boost their players or hinder opponents, adding a layer of strategic gameplay. Strategy suggestions are offered using AI based on team compositions. LLM tool provides reasoned suggestions on when/if to play each card type.
- Avatar Customization: Players earn in-game currency to customize their avatars with different skins and items, providing a fun cosmetic element.

## Style Guidelines:

- Primary color: Vibrant blue (#29ABE2), reminiscent of a clear sky on match day. This creates an inviting feel.
- Background color: Light blue (#E1F5FE), provides a clean, non-distracting backdrop.
- Accent color: Yellow-gold (#FFD700), symbolizes victory and achievement.
- Headline font: 'Poppins', a geometric sans-serif for a modern, fashionable look. Body font: 'PT Sans', a humanist sans-serif.
- Use clean, modern icons for player positions, card types, and in-game currency.
- Employ a clear, intuitive layout that prioritizes key information. The mobile-first responsive design ensures accessibility.
- Use subtle animations to enhance user experience such as transitions and updates, when new players are added, for example.