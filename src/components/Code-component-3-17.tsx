import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Users, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, User, Reservation } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TableSelectionProps {
  user: User;
  onTableSelect: (reservation: Reservation) => void;
  onLogout: () => void;
}

const mockTables: Table[] = [
  { id: '1', number: 1, seats: 2, available: true, position: { x: 20, y: 20 } },
  { id: '2', number: 2, seats: 4, available: true, position: { x: 60, y: 20 } },
  { id: '3', number: 3, seats: 6, available: false, position: { x: 20, y: 60 } },
  { id: '4', number: 4, seats: 2, available: true, position: { x: 60, y: 60 } },
  { id: '5', number: 5, seats: 4, available: true, position: { x: 40, y: 40 } },
  { id: '6', number: 6, seats: 8, available: true, position: { x: 80, y: 40 } },
];

const availableTimes = [
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export function TableSelection({ user, onTableSelect, onLogout }: TableSelectionProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleReserve = () => {
    if (!selectedTable || !selectedDate || !selectedTime) return;

    const reservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      seats: selectedTable.seats,
      date: format(selectedDate, 'dd/MM/yyyy'),
      time: selectedTime,
      userId: user.id,
      status: 'pending',
      paymentAmount: selectedTable.seats * 25, // R$ 25 por pessoa
      createdAt: new Date()
    };

    onTableSelect(reservation);
  };

  const canReserve = selectedTable && selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">RestauReserva</h1>
            <p className="text-sm text-muted-foreground">Olá, {user.name}</p>
          </div>
          <Button variant="ghost" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mapa das Mesas */}
          <div className="space-y-4">
            <h2>Selecionar Mesa</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Layout do Restaurante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-slate-50 rounded-lg p-4 h-80">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1737140790038-30560e59618c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBtb2Rlcm4lMjB0YWJsZXxlbnwxfHx8fDE3NTcxMTcxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Interior do restaurante"
                    className="absolute inset-0 w-full h-full object-cover rounded opacity-20"
                  />
                  
                  {mockTables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => table.available ? setSelectedTable(table) : null}
                      className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all
                        ${table.available 
                          ? selectedTable?.id === table.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:border-primary hover:shadow-md'
                          : 'bg-muted border-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                      style={{ 
                        left: `${table.position.x}%`, 
                        top: `${table.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      disabled={!table.available}
                    >
                      <span className="text-xs">{table.number}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-background border border-border"></div>
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Selecionada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted"></div>
                    <span>Ocupada</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mesas em Lista */}
            <Card>
              <CardHeader>
                <CardTitle>Mesas Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {mockTables.filter(t => t.available).map((table) => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      className={`p-3 text-left rounded-lg border transition-colors
                        ${selectedTable?.id === table.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                        }`}
                    >
                      <div>Mesa {table.number}</div>
                      <div className="text-sm text-muted-foreground">
                        {table.seats} lugares
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seleção de Data e Horário */}
          <div className="space-y-4">
            <h2>Detalhes da Reserva</h2>
            
            {selectedTable && (
              <Card>
                <CardHeader>
                  <CardTitle>Mesa Selecionada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div>Mesa {selectedTable.number}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedTable.seats} lugares
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Data da Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? 
                        format(selectedDate, "PPP", { locale: ptBR }) : 
                        "Selecionar data"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horário</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {canReserve && (
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mesa:</span>
                    <span>{selectedTable.number} ({selectedTable.seats} lugares)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span>{format(selectedDate!, "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horário:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor estimado:</span>
                    <span>R$ {selectedTable.seats * 25 * selectedTable.seats}</span>
                  </div>
                  
                  <Button onClick={handleReserve} className="w-full mt-4">
                    Continuar Reserva
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}