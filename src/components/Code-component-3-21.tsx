import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, CreditCard, CheckCircle, Users, Clock, Calendar } from 'lucide-react';
import { Reservation, User } from '../App';

interface ReservationConfirmProps {
  reservation: Reservation;
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
  onBack: () => void;
}

export function ReservationConfirm({ 
  reservation, 
  user, 
  onConfirm, 
  onCancel, 
  onBack 
}: ReservationConfirmProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const depositAmount = Math.round(reservation.paymentAmount * 0.3);
  
  const handlePayment = () => {
    setIsProcessingPayment(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentSuccess(true);
      
      // Aguardar 2 segundos e confirmar reserva
      setTimeout(() => {
        onConfirm();
      }, 2000);
    }, 3000);
  };

  if (showPaymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2>Pagamento Confirmado!</h2>
              <p className="text-muted-foreground">
                Processando sua reserva...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isProcessingPayment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h2>Processando Pagamento</h2>
              <p className="text-muted-foreground">
                Aguarde enquanto processamos seu pagamento...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl">Confirmação da Reserva</h1>
            <p className="text-sm text-muted-foreground">Revise os detalhes da sua reserva</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Detalhes da Reserva */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Detalhes da Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Mesa</label>
                    <div className="p-3 bg-primary/5 rounded-lg border">
                      Mesa {reservation.tableNumber}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Pessoas</label>
                    <div className="p-3 bg-muted rounded-lg">
                      {reservation.seats} lugares
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Data
                    </label>
                    <div className="p-3 bg-muted rounded-lg">
                      {reservation.date}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Horário
                    </label>
                    <div className="p-3 bg-muted rounded-lg">
                      {reservation.time}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Nome</label>
                  <p>{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">E-mail</label>
                  <p>{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Telefone</label>
                  <p>{user.phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pagamento */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pagamento da Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-amber-800 mb-2">Política de Pagamento</h3>
                  <p className="text-sm text-amber-700">
                    É obrigatório o pagamento de 30% do valor total no ato da reserva. 
                    A reserva só será confirmada após o pagamento.
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Valor estimado da mesa:</span>
                    <span>R$ {reservation.paymentAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor do depósito (30%):</span>
                    <span className="font-medium">R$ {depositAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span>Total a pagar agora:</span>
                    <span className="font-medium">R$ {depositAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    O valor restante de <strong>R$ {(reservation.paymentAmount - depositAmount).toFixed(2)}</strong> será 
                    pago no restaurante no dia da reserva.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Política de Cancelamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p><strong>Até 1 hora antes:</strong></p>
                      <p>Cancelamento gratuito com devolução total do valor pago (30%)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    <div>
                      <p><strong>Menos de 1 hora antes:</strong></p>
                      <p>Sem devolução do valor pago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar Reserva
              </Button>
              <Button 
                onClick={handlePayment}
                className="flex-1"
              >
                Pagar e Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}