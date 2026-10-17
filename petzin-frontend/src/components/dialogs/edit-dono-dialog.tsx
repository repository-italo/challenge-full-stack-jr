import { useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/components/ui/dialog';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { useEditDono } from '@/hooks/dono.hooks';

interface Dono {
    id: number;
    nome: string;
    telefone: string;
}

interface EditDonoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    dono: Dono;
}

export function EditDonoDialog({ open, onOpenChange, onSuccess, dono }: EditDonoDialogProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { mutate: editDono, isPending } = useEditDono(dono.id);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        editDono(
            {
                nome: formData.get('nome') as string,
                telefone: formData.get('telefone') as string,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess();
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Dono</DialogTitle>
                    <DialogDescription>Atualize as informações do cliente</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-nome">Nome *</Label>
                        <Input
                            id="edit-nome"
                            name="nome"
                            defaultValue={dono.nome}
                            placeholder="Nome do dono"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-telefone">Telefone *</Label>
                        <Input
                            id="edit-telefone"
                            name="telefone"
                            defaultValue={dono.telefone}
                            placeholder="Telefone"
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
