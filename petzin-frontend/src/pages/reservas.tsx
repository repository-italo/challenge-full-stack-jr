import { useState } from 'react';
import { useReservas } from '@/hooks/reserva.hooks';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';

export function Reservas() {
    const [filters, setFilters] = useState({
        data_entrada: '',
        data_saida: '',
        id_canil: '',
    });

    const {
        data: reservas = [],
        isLoading,
        error,
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
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-700">{reserva.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{reserva.pet_nome || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{reserva.dono_nome || '-'}</td>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
