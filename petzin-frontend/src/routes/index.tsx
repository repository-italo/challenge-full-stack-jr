import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/home';
import { Clientes } from '../pages/clientes';
import { Disponibilidade } from '../pages/disponibilidade';
import { FormReservas } from '../pages/form-criar-reservas';
import { Reservas } from '../pages/reservas';

export const router = createBrowserRouter([
    {
        element: (
            <MainLayout>
                <Home />
            </MainLayout>
        ),
        path: '/',
    },
    {
        element: (
            <MainLayout>
                <Clientes />
            </MainLayout>
        ),
        path: '/clientes',
    },
    {
        element: (
            <MainLayout>
                <FormReservas />
            </MainLayout>
        ),
        path: '/criar-reserva',
    },
    {
        element: (
            <MainLayout>
                <Disponibilidade />
            </MainLayout>
        ),
        path: '/disponibilidade',
    },
    {
        element: (
            <MainLayout>
                <Reservas />
            </MainLayout>
        ),
        path: '/reservas',
    },
]);
