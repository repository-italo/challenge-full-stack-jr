import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    navigationMenuTriggerStyle,
} from '@/components/components/ui/navigation-menu';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/clientes', label: 'Clientes' },
        { path: '/criar-reserva', label: 'Criar Reserva' },
        { path: '/disponibilidade', label: 'Disponibilidade' },
        { path: '/reservas', label: 'Reservas' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-3xl">🐕</span>
                            <span className="text-2xl font-bold text-blue-600">Petzin</span>
                        </Link>

                        {/* Menu Links */}
                        <NavigationMenu>
                            <NavigationMenuList className="gap-4">
                                {navLinks.map((link) => (
                                    <NavigationMenuItem key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={navigationMenuTriggerStyle({
                                                className: isActive(link.path) ? 'text-blue-600' : '',
                                            })}
                                        >
                                            {link.label}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="min-h-[calc(100vh-80px)]">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p>&copy; 2026 Petzin. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
