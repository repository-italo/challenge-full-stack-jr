import { useEditReserva } from '@/hooks';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/components/ui/dialog';
import { Label } from '@/components/components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import type { Pet } from '@/types/pet';

interface ReservaEdit {
    pet?: Pet;
    id: number;
    id_pet: number;
    id_canil: number;
    data_entrada: Date;
    data_saida: Date;
}

interface Canil {
    id: number;
    numero: number;
}

interface EditReservaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    reserva: ReservaEdit;
    canils: Canil[];
}

export function EditReservaDialog({ open, onOpenChange, onSuccess, reserva, canils }: EditReservaDialogProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedCanilId, setSelectedCanilId] = useState<number | null>(reserva.id_canil);
    const { mutate: deleteReserva, isPending } = useEditReserva(reserva.id);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const entradaDate = new Date(reserva.data_entrada);
    entradaDate.setUTCHours(0, 0, 0, 0);
    const saidaDate = new Date(reserva.data_saida);
    saidaDate.setUTCHours(0, 0, 0, 0);

    const isOngoing = today >= entradaDate && today <= saidaDate;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateString = minDate.toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const dataEntrada = formData.get('data_entrada') as string;
        const dataSaida = formData.get('data_saida') as string;

        deleteReserva(
            {
                id_canil: Number(formData.get('id_canil')) as number,
                data_entrada: new Date(dataEntrada + 'T00:00:00').toISOString(),
                data_saida: new Date(dataSaida + 'T00:00:00').toISOString(),
            },
            {
                onSuccess: () => {
                    toast.success('Reserva atualizada com sucesso!');
                    onOpenChange(false);
                    onSuccess();
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao atualizar reserva';

                    let displayMessage = errorMessage;
                    if (errorMessage.includes('conflitando')) {
                        displayMessage = '❌ Este pet já possui uma reserva no período selecionado';
                    } else if (errorMessage.includes('cachorros no canil')) {
                        displayMessage = '❌ O proprietário já tem 2 cachorros neste canil. Máximo de 2 animais por proprietário por canil';
                    } else {
                        displayMessage = `❌ ${errorMessage}`;
                    }

                    toast.error(displayMessage);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Reserva</DialogTitle>
                    <DialogDescription>
                        Atualize as informações da reserva para: {reserva.pet?.nome ?? 'Não Especificado'}
                    </DialogDescription>
                </DialogHeader>
                {isOngoing && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                        Esta reserva está em andamento e não pode ser editada.
                    </div>
                )}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="canil-select">Canil *</Label>
                        <select
                            id="canil-select"
                            name="id_canil"
                            value={selectedCanilId || ''}
                            onChange={(e) => setSelectedCanilId(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            disabled={isOngoing || isPending}
                        >
                            <option value="">Selecione um canil</option>
                            {canils.map((canil) => (
                                <option key={canil.id} value={canil.id}>
                                    Canil {canil.numero}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data-entrada">Data de Entrada *</Label>
                        <Input
                            id="data-entrada"
                            name="data_entrada"
                            type="date"
                            min={minDateString}
                            defaultValue={
                                reserva.data_entrada instanceof Date
                                    ? reserva.data_entrada.toISOString().split('T')[0]
                                    : reserva.data_entrada
                            }
                            required
                            disabled={isOngoing || isPending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data-saida">Data de Saída *</Label>
                        <Input
                            id="data-saida"
                            name="data_saida"
                            type="date"
                            min={minDateString}
                            defaultValue={
                                reserva.data_saida instanceof Date
                                    ? reserva.data_saida.toISOString().split('T')[0]
                                    : reserva.data_saida
                            }
                            required
                            disabled={isOngoing || isPending}
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || isOngoing}
                            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
