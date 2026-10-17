import { useRef } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/components/ui/dialog';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { useEditPet } from '@/hooks/pet.hooks';
import type { Pet } from '@/types/pet';

interface EditPetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    pet: Pet;
}

export function EditPetDialog({ open, onOpenChange, onSuccess, pet }: EditPetDialogProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { mutate: editPet, isPending } = useEditPet(pet.id);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        editPet(
            {
                nome: formData.get('nome') as string,
                raca: formData.get('raca') as string,
            },
            {
                onSuccess: () => {
                    toast.success('Pet atualizado com sucesso!');
                    onOpenChange(false);
                    onSuccess();
                },
                onError: (error: any) => {
                    const message = error?.response?.data?.message || error?.message || 'Erro ao atualizar pet';
                    toast.error(message);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Pet</DialogTitle>
                    <DialogDescription>Atualize as informações do pet</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-pet-nome">Nome *</Label>
                        <Input
                            id="edit-pet-nome"
                            name="nome"
                            defaultValue={pet.nome}
                            placeholder="Nome do pet"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-pet-raca">Raça *</Label>
                        <Input
                            id="edit-pet-raca"
                            name="raca"
                            defaultValue={pet.raca}
                            placeholder="Raça do pet"
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-blue-600 text-white hover:bg-blue-700">
                            {isPending ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
