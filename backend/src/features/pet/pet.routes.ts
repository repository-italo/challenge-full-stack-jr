import { type Express, Router } from 'express';
import { createValidator } from '@/shared/middleware/index.js';
import { PetController } from './pet.controller.js';
import { PetRepository } from './pet.repository.js';
import { createPetSchema, petParamsSchema, updatePetSchema } from './pet.schemas.js';
import { PetService } from './pet.service.js';

export function createPetRouter(app: Express): void {
    const router = Router();

    const petRepository = new PetRepository();
    const petService = new PetService(petRepository);
    const petController = new PetController(petService);

    router.get('/', (req, res) => petController.getAll(req, res));
    router.get('/:id', createValidator(petParamsSchema, 'params'), (req, res) => petController.getById(req, res));
    router.post('/', createValidator(createPetSchema, 'body'), (req, res) => petController.create(req, res));
    router.put(
        '/:id',
        createValidator(petParamsSchema, 'params'),
        createValidator(updatePetSchema, 'body'),
        (req, res) => petController.update(req, res),
    );
    router.delete('/:id', createValidator(petParamsSchema, 'params'), (req, res) => petController.delete(req, res));

    app.use('/pets', router);
}
