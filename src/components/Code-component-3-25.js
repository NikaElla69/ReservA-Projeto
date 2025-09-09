import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, XCircle, Clock, Home } from 'lucide-react';
import { Reservation } from '../App';

interface ReservationCancelProps {
  reservation: Reservation;
  onBack: () => void;
}

export function ReservationCancel({ reservation, onBack }: ReservationCancelProps) {
  const [timeUntilReservation, setTimeUntilReservation] = useState<number>(0);
  const [canRefund, setCanRefund] = useState(false);

  useEffect(() => {
    // Simular cálculo do tempo até a reserva
    // Para demo, vamos simular que a reserva é hoje
    const reservationDateTime = new Date();
    const [hours, minutes] = reservation.time.split(':').map(Number);
    reservationDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const timeDiff = reservationDateTime.getTime() - now.getTime();
    const hoursUntil = timeDiff / (1000 * 60 * 60);
    
    setTimeUntilReservation(hoursUntil);
    setCanRefund(hoursUntil > 1);
  }, [reservation]);

  const depositAmount = Math.round(reservation.paymentAmount * 0.3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl">Cancelamento da Reserva</h1>
          <p className="text-sm text-muted-foreground">Informações sobre o cancelamento</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        <div className="space-y-6">
          {/* Status do Cancelamento */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                <div>
                  <h2>Reserva Cancelada</h2>
                  <p className="text-muted-foreground">
                    Sua reserva foi cancelada com sucesso
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Reserva Cancelada */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Mesa</label>
                  <p>Mesa {reservation.tableNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Pessoas</label>
                  <p>{reservation.seats} lugares</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Data</label>
                  <p>{reservation.date}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Horário</label>
                  <p>{reservation.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Política de Reembolso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Política de Reembolso
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canRefund ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <Clock className="h-4 w-4" />
                      <h3>Cancelamento realizado com sucesso</h3>
                    </div>
                    <p className="text-green-700 text-sm">
                      Como o cancelamento foi feito com mais de 1 hora de antecedência, 
                      você receberá o estorno completo do valor pago.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Valor pago na reserva:</span>
                      <span>R$ {depositAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de cancelamento:</span>
                      <span>R$ 0,00</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg">
                        <span>Valor a ser estornado:</span>
                        <span className="text-green-600 font-medium">R$ {depositAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      O estorno será processado em até 5 dias úteis na mesma forma de pagamento utilizada.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <h3>Cancelamento fora do prazo</h3>
                    </div>
                    <p className="text-red-700 text-sm">
                      Como o cancelamento foi feito com menos de 1 hora de antecedência, 
                      não há devolução do valor pago conforme nossa política.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Valor pago na reserva:</span>
                      <span>R$ {depositAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Taxa de cancelamento:</span>
                      <span>R$ {depositAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg">
                        <span>Valor a ser estornado:</span>
                        <span className="font-medium">R$ 0,00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-700">
                      Para evitar taxas de cancelamento, recomendamos cancelar com pelo menos 1 hora de antecedência.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Esperamos vê-lo em breve!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Agradecemos por escolher o RestauReserva. Esperamos poder servi-lo em uma próxima oportunidade!
              </p>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Você pode fazer uma nova reserva a qualquer momento</p>
                <p>• Entre em contato conosco para dúvidas: (11) 1234-5678</p>
                <p>• Siga-nos nas redes sociais para novidades e promoções</p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={onBack} className="w-full gap-2">
            <Home className="h-4 w-4" />
            Fazer Nova Reserva
          </Button>
        </div>
      </div>
    </div>
  );
}