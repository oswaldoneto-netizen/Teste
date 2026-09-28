# RNG Pedras Online

Leaderboard online Top 5.

## Render
Use **Web Service**, não Static Site.
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node

O servidor mantém jogadores online por heartbeat e remove quem ficar 50s sem responder. O leaderboard é atualizado no cliente a cada 40 segundos.

XP: cada pedra derrotada = +10 XP; a cada 100 XP sobe 1 nível.
