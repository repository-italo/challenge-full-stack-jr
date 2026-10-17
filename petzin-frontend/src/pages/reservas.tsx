import { useState } from 'react';
import { useReservas } from '@/hooks/reserva.hooks';
import { useCanils, useDonos, usePets } from '@/hooks';
import { useDeleteReserva } from '@/hooks/reserva.hooks';
import type { Reserva } from '@/types/reserva';
import { toast } from 'sonner';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { EditReservaDialog } from '@/components/dialogs/edit-reserva-dialog';

export function Reservas() {
    const [filters, setFilters] = useState({
        data_entrada: '',
        data_saida: '',
        id_canil: '',
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);

    const {
        data: reservas = [],
        isLoading,
        error,
        refetch,
    } = useReservas(
        Object.keys(filters).reduce(
            (acc, key) => {
                const filterKey = key as keyof typeof filters;
                if (filters[filterKey]) {
                    if (filterKey === 'id_canil') {
                        acc[filterKey] = parseInt(filters[filterKey], 10);
                    } else {
                        acc[filterKey] = filters[filterKey];
                    }
                }
                return acc;
            },
            {} as { id_canil?: number; data_entrada?: string; data_saida?: string },
        ),
    );

    const { data: canils = [] } = useCanils();
    const { data: donos = [] } = useDonos();
    const { data: pets = [] } = usePets();
    const { mutate: deleteReserva } = useDeleteReserva();

    const getPetName = (petId: number): string => {
        return pets.find((p) => p.id === petId)?.nome || '-';
    };

    const getDonoName = (petId: number): string => {
        const pet = pets.find((p) => p.id === petId);
        if (!pet) return '-';
        return donos.find((d) => d.id === pet.id_dono)?.nome || '-';
    };

    const handleEditClick = (reserva: Reserva) => {
        setSelectedReserva(reserva);
        setDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        setDialogOpen(false);
        setSelectedReserva(null);
        refetch();
    };

    const handleDeleteClick = (reserva: Reserva) => {
        if (
            !confirm(
                `Tem certeza que deseja deletar a reserva para ${pets.find((pet) => pet.id === reserva.id_pet)?.nome ?? 'Não Especificado'}?`,
            )
        ) {
            return;
        }

        deleteReserva(reserva.id, {
            onSuccess: () => {
                toast.success('Reserva deletada com sucesso!');
                refetch();
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || error?.message || 'Erro ao deletar reserva';
                toast.error(message);
            },
        });
    };

    const isReservaOngoing = (reserva: Reserva): boolean => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const entrada = new Date(reserva.data_entrada);
        entrada.setUTCHours(0, 0, 0, 0);
        const saida = new Date(reserva.data_saida);
        saida.setUTCHours(0, 0, 0, 0);
        return today >= entrada && today <= saida;
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            data_entrada: '',
            data_saida: '',
            id_canil: '',
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Reservas</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="data_entrada">Data de Entrada</Label>
                        <Input
                            id="data_entrada"
                            name="data_entrada"
                            type="date"
                            value={filters.data_entrada}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data_saida">Data de Saída</Label>
                        <Input
                            id="data_saida"
                            name="data_saida"
                            type="date"
                            value={filters.data_saida}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="id_canil">Canil ID</Label>
                        <Input
                            id="id_canil"
                            name="id_canil"
                            type="number"
                            min="1"
                            max="15"
                            value={filters.id_canil}
                            onChange={handleFilterChange}
                            placeholder="1-15"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleClearFilters} variant="outline" className="w-full">
                            Limpar Filtros
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="p-6 text-center text-gray-500">Carregando reservas...</div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">Erro ao carregar reservas. Tente novamente.</div>
                ) : reservas.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">Nenhuma reserva encontrada</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pet</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dono</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Canil</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Data Entrada
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Data Saída
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Valor Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-700">{reserva.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {getPetName(reserva.id_pet)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {getDonoName(reserva.id_pet)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{reserva.id_canil}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {formatDate(reserva.data_entrada)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {formatDate(reserva.data_saida)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            R$ {Number(reserva.valor_total_pago).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditClick(reserva)}
                                                disabled={isReservaOngoing(reserva)}
                                                title={
                                                    isReservaOngoing(reserva)
                                                        ? 'Não é possível editar uma reserva em andamento'
                                                        : ''
                                                }
                                                className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteClick(reserva)}
                                                disabled={isReservaOngoing(reserva)}
                                                title={
                                                    isReservaOngoing(reserva)
                                                        ? 'Não é possível deletar uma reserva em andamento'
                                                        : ''
                                                }
                                                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Deletar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedReserva && (
                <EditReservaDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={handleDialogSuccess}
                    reserva={{
                        id: selectedReserva.id,
                        data_entrada: new Date(selectedReserva.data_entrada),
                        data_saida: new Date(selectedReserva.data_saida),
                        id_canil: selectedReserva.id_canil,
                        id_pet: selectedReserva.id_pet,
                        pet: pets.find((pet) => pet.id === selectedReserva.id_pet),
                    }}
                    canils={canils}
                />
            )}
        </div>
    );
}
