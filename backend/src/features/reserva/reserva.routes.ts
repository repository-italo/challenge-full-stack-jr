import { type Express, Router } from 'express';
import { createValidator } from '@/shared/middleware/index.js';
import { CanilRepository } from '../canil/canil.repository.js';
import { ReservaController } from './reserva.controller.js';
import { ReservaRepository } from './reserva.repository.js';
import {
    createReservaSchema,
    getReservasQuerySchema,
    reservaParamsSchema,
    updateReservaSchema,
} from './reserva.schemas.js';
import { ReservaService } from './reserva.service.js';
import { PetRepository } from '../pet/pet.repository.js';

export function createReservaRouter(app: Express): void {
    const router = Router();

    const reservaRepository = new ReservaRepository();
    const petRepository = new PetRepository();
    const canilRepository = new CanilRepository();
    const reservaService = new ReservaService(petRepository, reservaRepository, canilRepository);
    const reservaController = new ReservaController(reservaService);

    router.get('/', createValidator(getReservasQuerySchema, 'query'), (req, res) => reservaController.getAll(req, res));
    router.get('/:id', createValidator(reservaParamsSchema, 'params'), (req, res) =>
        reservaController.getById(req, res),
    );
    router.post('/', createValidator(createReservaSchema, 'body'), (req, res) => reservaController.create(req, res));
    router.put(
        '/:id',
        createValidator(reservaParamsSchema, 'params'),
        createValidator(updateReservaSchema, 'body'),
        (req, res) => reservaController.update(req, res),
    );
    router.delete('/:id', createValidator(reservaParamsSchema, 'params'), (req, res) =>
        reservaController.delete(req, res),
    );

    app.use('/reservas', router);
}
