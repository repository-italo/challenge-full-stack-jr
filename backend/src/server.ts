import express from 'express';
import { initConnection } from '@/integrations/database/sequelize.js';

const app = express();
const PORT = process.env.PORT || 3000;
await initConnection();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`App working in port ${PORT}`);
});
