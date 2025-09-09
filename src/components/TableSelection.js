import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';
import { CalendarIcon, Users, ArrowLeft, MapPin, Star, Phone, AlertCircle } from 'lucide-react';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, Restaurant, Reservation } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TableSelectionProps {
  restaurant: Restaurant;
  onTableSelect: (reservation: Reservation) => void;
  onBack: () => void;
}

const mockTables: Table[] = [
  { id: '1', number: 1, seats: 2, available: true, position: { x: 20, y: 20 } },
  { id: '2', number: 2, seats: 4, available: true, position: { x: 60, y: 20 } },
  { id: '3', number: 3, seats: 6, available: false, position: { x: 20, y: 60 } },
  { id: '4', number: 4, seats: 2, available: true, position: { x: 60, y: 60 } },
  { id: '5', number: 5, seats: 4, available: true, position: { x: 40, y: 40 } },
  { id: '6', number: 6, seats: 8, available: true, position: { x: 80, y: 40 } },
];

// Simulação de reservas existentes por data
const mockReservations: Record<string, { tableId: string; time: string }[]> = {
  '2025-01-10': [
    { tableId: '1', time: '19:00' },
    { tableId: '1', time: '21:00' },
    { tableId: '2', time: '18:00' },
    { tableId: '3', time: '20:00' }
  ],
  '2025-01-11': [
    { tableId: '1', time: '18:00' },
    { tableId: '2', time: '19:00' },
    { tableId: '2', time: '20:00' },
    { tableId: '4', time: '19:30' }
  ],
  '2025-01-12': [
    { tableId: '1', time: '18:00' },
    { tableId: '1', time: '18:30' },
    { tableId: '1', time: '19:00' },
    { tableId: '1', time: '19:30' },
    { tableId: '1', time: '20:00' },
    { tableId: '1', time: '20:30' },
    { tableId: '1', time: '21:00' },
    { tableId: '1', time: '21:30' },
    { tableId: '1', time: '22:00' },
    { tableId: '2', time: '18:00' },
    { tableId: '2', time: '18:30' },
    { tableId: '2', time: '19:00' },
    { tableId: '2', time: '19:30' },
    { tableId: '2', time: '20:00' },
    { tableId: '2', time: '20:30' },
    { tableId: '2', time: '21:00' },
    { tableId: '2', time: '21:30' },
    { tableId: '2', time: '22:00' },
    { tableId: '4', time: '18:00' },
    { tableId: '4', time: '18:30' },
    { tableId: '4', time: '19:00' },
    { tableId: '4', time: '19:30' },
    { tableId: '4', time: '20:00' },
    { tableId: '4', time: '20:30' },
    { tableId: '4', time: '21:00' },
    { tableId: '4', time: '21:30' },
    { tableId: '4', time: '22:00' },
    { tableId: '5', time: '18:00' },
    { tableId: '5', time: '18:30' },
    { tableId: '5', time: '19:00' },
    { tableId: '5', time: '19:30' },
    { tableId: '5', time: '20:00' },
    { tableId: '5', time: '20:30' },
    { tableId: '5', time: '21:00' },
    { tableId: '5', time: '21:30' },
    { tableId: '5', time: '22:00' },
    { tableId: '6', time: '18:00' },
    { tableId: '6', time: '18:30' },
    { tableId: '6', time: '19:00' },
    { tableId: '6', time: '19:30' },
    { tableId: '6', time: '20:00' },
    { tableId: '6', time: '20:30' },
    { tableId: '6', time: '21:00' },
    { tableId: '6', time: '21:30' },
    { tableId: '6', time: '22:00' }
  ]
};

const allAvailableTimes = [
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export function TableSelection({ restaurant, onTableSelect, onBack }: TableSelectionProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Reset do horário quando mesa ou data mudam
  useEffect(() => {
    setSelectedTime('');
  }, [selectedTable, selectedDate]);

  // Reset da data se ela se torna inválida (mudança de restaurante)
  useEffect(() => {
    if (selectedDate) {
      const dayOfWeek = selectedDate.getDay();
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      const isInvalid = isBefore(startOfDay(selectedDate), startOfDay(new Date())) ||
                       !restaurant.operatingDays.includes(dayOfWeek) ||
                       restaurant.closedDates?.includes(dateString);
      
      if (isInvalid) {
        setSelectedDate(undefined);
        setSelectedTime('');
      }
    }
  }, [restaurant.id, selectedDate, restaurant.operatingDays, restaurant.closedDates]);

  // Função para verificar se uma data é válida para o restaurante
  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Verificar se é anterior a hoje
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return false;
    }
    
    // Verificar se o restaurante opera neste dia da semana
    if (!restaurant.operatingDays.includes(dayOfWeek)) {
      return false;
    }
    
    // Verificar se está na lista de datas fechadas
    if (restaurant.closedDates?.includes(dateString)) {
      return false;
    }
    
    return true;
  };

  // Função para verificar se uma data tem alguma mesa disponível
  const hasAvailableTables = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayReservations = mockReservations[dateString] || [];
    
    // Verificar se há pelo menos um horário disponível para alguma mesa
    for (const table of mockTables.filter(t => t.available)) {
      const tableReservations = dayReservations.filter(r => r.tableId === table.id);
      if (tableReservations.length < allAvailableTimes.length) {
        return true;
      }
    }
    
    return false;
  };

  // Função completa para desabilitar datas
  const isDateDisabled = (date: Date) => {
    if (!isDateAvailable(date)) {
      return true;
    }
    
    // Se é uma data operacional, verificar se tem mesas disponíveis
    return !hasAvailableTables(date);
  };

  // Horários disponíveis para a mesa e data selecionadas
  const availableTimes = useMemo(() => {
    if (!selectedTable || !selectedDate) return [];
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dayReservations = mockReservations[dateString] || [];
    const tableReservations = dayReservations.filter(r => r.tableId === selectedTable.id);
    const reservedTimes = tableReservations.map(r => r.time);
    
    return allAvailableTimes.filter(time => !reservedTimes.includes(time));
  }, [selectedTable, selectedDate]);

  // Verificar se a data selecionada é válida
  const selectedDateStatus = useMemo(() => {
    if (!selectedDate) return null;
    
    const dayOfWeek = selectedDate.getDay();
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    if (!restaurant.operatingDays.includes(dayOfWeek)) {
      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const operatingDayNames = restaurant.operatingDays.map(d => dayNames[d]);
      return {
        type: 'closed' as const,
        message: `${restaurant.name} não funciona às ${dayNames[dayOfWeek]}s. Dias de funcionamento: ${operatingDayNames.join(', ')}.`
      };
    }
    
    if (restaurant.closedDates?.includes(dateString)) {
      return {
        type: 'holiday' as const,
        message: `${restaurant.name} está fechado nesta data devido a feriado ou evento especial.`
      };
    }
    
    if (!hasAvailableTables(selectedDate)) {
      return {
        type: 'full' as const,
        message: `Todas as mesas estão reservadas para esta data. Tente escolher outra data.`
      };
    }
    
    return {
      type: 'available' as const,
      message: null
    };
  }, [selectedDate, restaurant]);

  const handleReserve = () => {
    if (!selectedTable || !selectedDate || !selectedTime) return;

    const reservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      seats: selectedTable.seats,
      date: format(selectedDate, 'dd/MM/yyyy'),
      time: selectedTime,
      userId: '',
      status: 'pending',
      paymentAmount: selectedTable.seats * 25, // R$ 25 por pessoa
      createdAt: new Date()
    };

    onTableSelect(reservation);
  };

  const canReserve = selectedTable && selectedDate && selectedTime && selectedDateStatus?.type === 'available';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Restaurantes
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl">{restaurant.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {restaurant.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {restaurant.rating}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {restaurant.phone}
              </span>
            </p>
          </div>
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
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">{restaurant.description}</p>
                  <div className="flex gap-4 text-sm">
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
                <p className="text-sm text-muted-foreground">
                  Funcionamento: {(() => {
                    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                    const operatingDayNames = restaurant.operatingDays.map(d => dayNames[d]);
                    return operatingDayNames.join(', ');
                  })()} • {restaurant.openHours}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={isDateDisabled}
                      initialFocus
                      fromDate={new Date()}
                      toDate={addDays(new Date(), 60)} // Permitir reservas até 60 dias
                    />
                  </PopoverContent>
                </Popover>

                {selectedDateStatus && selectedDateStatus.type !== 'available' && (
                  <Alert variant={selectedDateStatus.type === 'closed' || selectedDateStatus.type === 'holiday' ? 'destructive' : 'default'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {selectedDateStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {selectedDate && selectedDateStatus?.type === 'available' && (
                  <div className="text-sm text-muted-foreground">
                    <p>✅ Data disponível para reservas</p>
                    <p>Horário de funcionamento: {restaurant.openHours}</p>
                  </div>
                )}

                {!selectedDate && (
                  <div className="text-sm text-muted-foreground">
                    <p>💡 Dica: Datas em cinza são indisponíveis por:</p>
                    <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                      <li>Restaurante fechado neste dia da semana</li>
                      <li>Feriados ou eventos especiais</li>
                      <li>Todas as mesas já reservadas</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select 
                  value={selectedTime} 
                  onValueChange={setSelectedTime}
                  disabled={!selectedTable || !selectedDate || selectedDateStatus?.type !== 'available'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedTable ? "Selecione uma mesa primeiro" :
                      !selectedDate ? "Selecione uma data primeiro" :
                      selectedDateStatus?.type !== 'available' ? "Data indisponível" :
                      availableTimes.length === 0 ? "Nenhum horário disponível" :
                      "Selecionar horário"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTable && selectedDate && selectedDateStatus?.type === 'available' && (
                  <div className="text-sm text-muted-foreground">
                    {availableTimes.length === 0 ? (
                      <p className="text-destructive">❌ Nenhum horário disponível para a Mesa {selectedTable.number} nesta data</p>
                    ) : (
                      <p>✅ {availableTimes.length} horário(s) disponível(is) para a Mesa {selectedTable.number}</p>
                    )}
                  </div>
                )}
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
                    <span>R$ {(selectedTable.seats * 25).toFixed(2)}</span>
                  </div>
                  
                  <Button onClick={handleReserve} className="w-full mt-4">
                    Fazer Login e Reservar
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