import express from 'express';
import cors from 'cors';
import { createCanilRouter } from './features/canil/canil.routes.js';
import { createDonoRouter } from './features/dono/dono.routes.js';
import { createPetRouter } from './features/pet/pet.routes.js';
import { createReservaRouter } from './features/reserva/reserva.routes.js';
import { initDatabase } from './integrations/database/index.js';
import { errorHandler, notFoundHandler } from './shared/middleware/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
await initDatabase();

app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());
createDonoRouter(app);
createPetRouter(app);
createReservaRouter(app);
createCanilRouter(app);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App working in port ${PORT}`);
});
