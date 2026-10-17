import { useState } from 'react';
import { useDonosWithPets } from '@/hooks';
import { useDeleteDono } from '@/hooks/dono.hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Button } from '@/components/components/ui/button';
import { CreateDonoDialog } from '@/components/dialogs/create-dono-dialog';
import { CreatePetDialog } from '@/components/dialogs/create-pet-dialog';
import { EditDonoDialog } from '@/components/dialogs/edit-dono-dialog';
import { toast } from 'sonner';

export function Clientes() {
    const { data: donos = [], isLoading, refetch } = useDonosWithPets();
    const [openCreateDono, setOpenCreateDono] = useState(false);
    const [openCreatePet, setOpenCreatePet] = useState(false);
    const [openEditDono, setOpenEditDono] = useState(false);
    const [selectedDonoForEdit, setSelectedDonoForEdit] = useState<any>(null);
    const { mutate: deleteDono } = useDeleteDono();

    const handleEditClick = (dono: any) => {
        setSelectedDonoForEdit(dono);
        setOpenEditDono(true);
    };

    const handleDeleteDono = (donoId: number) => {
        if (!confirm('Tem certeza que deseja deletar este cliente?')) return;
        deleteDono(donoId, {
            onSuccess: () => {
                toast.success('✅ Cliente deletado com sucesso!');
                refetch();
            },
            onError: (error: any) => {
                toast.error(`❌ Erro ao deletar: ${error.message}`);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Clientes</h1>
                <p className="text-gray-600">Carregando clientes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                <div className="flex gap-3">
                    <CreateDonoDialog open={openCreateDono} onOpenChange={setOpenCreateDono} onSuccess={refetch} />
                    <CreatePetDialog
                        open={openCreatePet}
                        onOpenChange={setOpenCreatePet}
                        onSuccess={refetch}
                        donos={donos}
                    />
                </div>
            </div>

            {donos.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Nenhum cliente cadastrado</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donos.map((dono) => (
                        <Card key={dono.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b">
                                <CardTitle className="text-xl text-blue-600">{dono.nome}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-2">Telefone:</p>
                                    <p className="text-gray-900 font-medium">{dono.telefone}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        Pets ({dono.pets?.length || 0})
                                    </h3>
                                    {dono.pets && dono.pets.length > 0 ? (
                                        <div className="space-y-2">
                                            {dono.pets.map((pet) => (
                                                <div
                                                    key={pet.id}
                                                    className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
                                                >
                                                    <p className="font-medium text-gray-900">{pet.nome}</p>
                                                    <p className="text-sm text-gray-600">{pet.raca}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Sem pets cadastrados</p>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-6 pt-6 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditClick(dono)}
                                        className="flex-1"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteDono(dono.id)}
                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Deletar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {selectedDonoForEdit && (
                <EditDonoDialog
                    open={openEditDono}
                    onOpenChange={setOpenEditDono}
                    onSuccess={refetch}
                    dono={selectedDonoForEdit}
                />
            )}
        </div>
    );
}
