import express from 'express';
import { createDonoRouter } from './features/dono/dono.routes.js';
import { createPetRouter } from './features/pet/pet.routes.js';
import { createReservaRouter } from './features/reserva/reserva.routes.js';
import { initDatabase } from './integrations/database/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
await initDatabase();

app.use(express.json());
createDonoRouter(app);
createPetRouter(app);
createReservaRouter(app);

app.listen(PORT, () => {
    console.log(`App working in port ${PORT}`);
});
