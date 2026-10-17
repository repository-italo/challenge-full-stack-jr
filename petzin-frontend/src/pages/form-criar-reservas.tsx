import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCanils, useCreateReserva, useDonosWithPets, usePets } from '@/hooks';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { Card, CardContent } from '@/components/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/components/ui/select';

const createReservaSchema = z
    .object({
        id_dono: z.number().int().positive('Proprietário é obrigatório'),
        id_pet: z.number().int().positive('Pet é obrigatório'),
        id_canil: z.number().int().positive('Canil é obrigatório'),
        data_entrada: z.string().min(1, 'Data de entrada é obrigatória'),
        data_saida: z.string().min(1, 'Data de saída é obrigatória'),
        valor_total_pago: z.number().positive('Valor total é obrigatório'),
    })
    .superRefine((data, ctx) => {
        if (new Date(data.data_saida) < new Date(data.data_entrada)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['data_saida'],
                message: 'Data de saída deve ser igual ou posterior à data de entrada',
            });
        }
    });

type CreateReservaInput = z.infer<typeof createReservaSchema>;

export function FormReservas() {
    const [selectedDonoId, setSelectedDonoId] = useState<number | null>(null);
    const [selectedCanilId, setSelectedCanilId] = useState<number | null>(null);
    const [dataEntrada, setDataEntrada] = useState<string>('');
    const [dataSaida, setDataSaida] = useState<string>('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [dateError, setDateError] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<CreateReservaInput>({
        resolver: zodResolver(createReservaSchema),
    });

    const handleReset = () => {
        reset();
        setSelectedDonoId(null);
        setSelectedCanilId(null);
        setDataEntrada('');
        setDataSaida('');
        setTotalPrice(0);
        setDateError('');
    };

    const { data: donos = [], isLoading: donosLoading } = useDonosWithPets();
    const { data: pets = [] } = usePets();
    const { data: canils = [] } = useCanils();
    const { mutate: createReserva, isPending } = useCreateReserva();

    const handleDateChange = (entrada: string, saida: string, canilId: number | null) => {
        if (!entrada || !saida || !canilId) {
            setTotalPrice(0);
            return;
        }

        const canil = canils.find((c) => c.id === canilId);
        if (!canil) return;

        const start = new Date(entrada);
        const end = new Date(saida);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (days > 0) {
            const total = days * canil.valor_diario;
            setTotalPrice(total);
            setValue('valor_total_pago', total);
        }
    };

    const onDonoChange = (id: string) => {
        const numId = Number(id);
        setSelectedDonoId(numId || null);
        setValue('id_dono', numId);
    };

    const onCanilChange = (id: string) => {
        const numId = Number(id);
        setSelectedCanilId(numId || null);
        setValue('id_canil', numId);
        handleDateChange(dataEntrada, dataSaida, numId);
    };

    const onPetChange = (id: string) => {
        setValue('id_pet', Number(id));
    };

    const getMinDate = (): string => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    };

    const onCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDataEntrada(value);
        handleDateChange(value, dataSaida, selectedCanilId);
        validateDates(value, dataSaida);
    };

    const onCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDataSaida(value);
        handleDateChange(dataEntrada, value, selectedCanilId);
        validateDates(dataEntrada, value);
    };

    const validateDates = (entrada: string, saida: string) => {
        if (entrada && saida) {
            const dataEntradaObj = new Date(entrada);
            const dataSaidaObj = new Date(saida);
            if (dataSaidaObj < dataEntradaObj) {
                setDateError('Data de saída deve ser igual ou posterior à data de entrada');
            } else {
                setDateError('');
            }
        }
    };

    const isFormValid = () => {
        return (
            selectedDonoId &&
            pets.length > 0 &&
            selectedCanilId &&
            dataEntrada &&
            dataSaida &&
            totalPrice > 0 &&
            !dateError &&
            Object.keys(errors).length === 0
        );
    };

    const onSubmit = (data: CreateReservaInput) => {
        createReserva(
            {
                ...data,
                data_entrada: new Date(data.data_entrada + 'T00:00:00').toISOString(),
                data_saida: new Date(data.data_saida + 'T00:00:00').toISOString(),
            },
            {
                onSuccess: () => {
                    toast.success('✅ Reserva criada com sucesso!');
                    setTimeout(() => {
                        window.history.back();
                    }, 1500);
                },
                onError: (error: any) => {
                    const errorMessage: string =
                        error?.response?.data?.message || error?.message || 'Erro ao criar reserva';

                    let displayMessage: string = errorMessage;
                    if (errorMessage.includes('conflitando')) {
                        displayMessage = '❌ Este pet já possui uma reserva no período selecionado';
                    } else if (errorMessage.includes('cachorros no canil')) {
                        displayMessage =
                            '❌ O proprietário já tem 2 cachorros reservados neste canil. Máximo de 2 animais por proprietário por canil';
                    } else {
                        displayMessage = `❌ ${errorMessage}`;
                    }

                    toast.error(displayMessage);
                },
            },
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold">Criar Reserva</h2>
                    </div>
                    {dateError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{dateError}</p>
                        </div>
                    )}
                    <div className="space-y-8">
                        {/* Dono */}
                        <div className="space-y-2 mb-6">
                            <Label htmlFor="dono">Proprietário *</Label>
                            <Select onValueChange={onDonoChange} disabled={donosLoading}>
                                <SelectTrigger id="dono">
                                    <SelectValue placeholder="Selecione um proprietário" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-[9999] bg-white">
                                    {donos.map((dono) => (
                                        <SelectItem key={dono.id} value={String(dono.id)}>
                                            {dono.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.id_dono && <p className="text-sm text-destructive">{errors.id_dono.message}</p>}
                        </div>

                        {/* Pet */}
                        <div className="space-y-2 mb-6">
                            <Label htmlFor="pet">Pet *</Label>
                            <Select onValueChange={onPetChange} disabled={!selectedDonoId || pets.length === 0}>
                                <SelectTrigger id="pet">
                                    <SelectValue placeholder="Selecione um pet" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-[9999] bg-white">
                                    {pets.map((pet) => (
                                        <SelectItem key={pet.id} value={String(pet.id)}>
                                            {pet.nome} ({pet.raca})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.id_pet && <p className="text-sm text-destructive">{errors.id_pet.message}</p>}
                            {selectedDonoId && pets.length === 0 && (
                                <p className="text-sm text-amber-600">Este proprietário não possui pets cadastrados</p>
                            )}
                        </div>

                        {/* Canil */}
                        <div className="space-y-2 mb-6">
                            <Label htmlFor="canil">Canil *</Label>
                            <Select onValueChange={onCanilChange}>
                                <SelectTrigger id="canil">
                                    <SelectValue placeholder="Selecione um canil" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-[9999] bg-white">
                                    {canils.map((canil) => (
                                        <SelectItem key={canil.id} value={String(canil.id)}>
                                            Canil #{canil.numero} - R$ {Number(canil?.valor_diario ?? 0)}/dia
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.id_canil && <p className="text-sm text-destructive">{errors.id_canil.message}</p>}
                        </div>

                        {/* Data de Entrada */}
                        <div className="space-y-2 mb-6">
                            <Label htmlFor="entrada">Data de Entrada *</Label>
                            <Input
                                id="entrada"
                                type="date"
                                min={getMinDate()}
                                {...register('data_entrada')}
                                onChange={onCheckInChange}
                            />
                            {errors.data_entrada && (
                                <p className="text-sm text-destructive">{errors.data_entrada.message}</p>
                            )}
                        </div>

                        {/* Data de Saída */}
                        <div className="space-y-2 mb-6">
                            <Label htmlFor="saida">Data de Saída *</Label>
                            <Input
                                id="saida"
                                type="date"
                                min={getMinDate()}
                                {...register('data_saida')}
                                onChange={onCheckOutChange}
                            />
                            {errors.data_saida && (
                                <p className="text-sm text-destructive">{errors.data_saida.message}</p>
                            )}
                        </div>

                        {/* Preço Total */}
                        <Card className="bg-blue-50">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Valor Diário</p>
                                        <p className="text-lg font-semibold">
                                            R${' '}
                                            {(selectedCanilId &&
                                                Number(
                                                    canils.find((c) => c.id === selectedCanilId)?.valor_diario,
                                                ).toFixed(2)) ||
                                                '0,00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Dias</p>
                                        <p className="text-lg font-semibold">
                                            {dataEntrada && dataSaida
                                                ? Math.ceil(
                                                      (new Date(dataSaida).getTime() -
                                                          new Date(dataEntrada).getTime()) /
                                                          (1000 * 60 * 60 * 24),
                                                  ) + 1
                                                : 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-muted-foreground">Total a Pagar</p>
                                    <p className="text-3xl font-bold text-blue-600">R$ {totalPrice.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hidden input for valor_total_pago */}
                        <input type="hidden" {...register('valor_total_pago', { valueAsNumber: true })} />

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isPending || !isFormValid()}
                                className={`flex-1 text-white cursor-pointer transition-colors ${
                                    isPending || !isFormValid()
                                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isPending ? 'Criando...' : 'Criar Reserva'}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                                Limpar
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
