import { useRef } from 'react';
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
import { useCreateDono } from '@/hooks/dono.hooks';

interface CreateDonoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateDonoDialog({ open, onOpenChange, onSuccess }: CreateDonoDialogProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { mutate: createDono, isPending } = useCreateDono();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        createDono(
            {
                nome: formData.get('nome') as string,
                telefone: formData.get('telefone') as string,
            },
            {
                onSuccess: () => {
                    if (formRef.current) {
                        formRef.current.reset();
                    }
                    onOpenChange(false);
                    onSuccess();
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    + Criar Dono
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Novo Dono</DialogTitle>
                    <DialogDescription>Adicione um novo cliente ao sistema</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input id="nome" name="nome" placeholder="Nome do dono" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input id="telefone" name="telefone" placeholder="Telefone" required />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-blue-600 text-white hover:bg-blue-700">
                            {isPending ? 'Criando...' : 'Criar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
