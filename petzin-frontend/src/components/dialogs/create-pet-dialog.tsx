import { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/components/ui/dialog';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { useCreatePet } from '@/hooks/pet.hooks';

interface Dono {
    id: number;
    nome: string;
}

interface CreatePetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    donos: Dono[];
}

export function CreatePetDialog({ open, onOpenChange, onSuccess, donos }: CreatePetDialogProps) {
    const [selectedDonoId, setSelectedDonoId] = useState<number | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { mutate: createPet, isPending } = useCreatePet();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedDonoId) {
            alert('Selecione um dono');
            return;
        }
        const formData = new FormData(e.currentTarget);

        createPet(
            {
                nome: formData.get('nome') as string,
                raca: formData.get('raca') as string,
                id_dono: selectedDonoId,
            },
            {
                onSuccess: () => {
                    if (formRef.current) {
                        formRef.current.reset();
                    }
                    setSelectedDonoId(null);
                    onOpenChange(false);
                    onSuccess();
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 text-white hover:bg-green-700">+ Criar Pet</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Novo Pet</DialogTitle>
                    <DialogDescription>Adicione um novo pet a um dono</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dono-select">Dono *</Label>
                        <select
                            id="dono-select"
                            value={selectedDonoId || ''}
                            onChange={(e) => setSelectedDonoId(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Selecione um dono</option>
                            {donos.map((dono) => (
                                <option key={dono.id} value={dono.id}>
                                    {dono.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pet-nome">Nome do Pet *</Label>
                        <Input id="pet-nome" name="nome" placeholder="Nome do pet" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pet-raca">Raça *</Label>
                        <Input id="pet-raca" name="raca" placeholder="Raça do pet" required />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            {isPending ? 'Criando...' : 'Criar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
