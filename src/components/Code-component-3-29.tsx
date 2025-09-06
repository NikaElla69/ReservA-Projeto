import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Calendar, Clock, Users, MapPin, Phone, Mail, Home } from 'lucide-react';
import { Reservation } from '../App';

interface ReservationSuccessProps {
  reservation: Reservation;
  onBack: () => void;
}

export function ReservationSuccess({ reservation, onBack }: ReservationSuccessProps) {
  const depositAmount = Math.round(reservation.paymentAmount * 0.3);
  const remainingAmount = reservation.paymentAmount - depositAmount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl">Reserva Confirmada</h1>
          <p className="text-sm text-muted-foreground">Sua mesa foi reservada com sucesso</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4">
        <div className="space-y-6">
          {/* Confirmação de Sucesso */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
                <div>
                  <h2>Reserva Confirmada!</h2>
                  <p className="text-muted-foreground">
                    Sua reserva foi processada e confirmada com sucesso
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Código: {reservation.id.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Reserva */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Reserva</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mesa e Lugares</p>
                      <p>Mesa {reservation.tableNumber} • {reservation.seats} pessoas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p>{reservation.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p>{reservation.time}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p>Rua das Flores, 123<br />Vila Madalena - São Paulo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p>(11) 1234-5678</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Valor total estimado:</span>
                  <span>R$ {reservation.paymentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span>✓ Pago agora (30%):</span>
                  <span>R$ {depositAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Restante (a pagar no local):</span>
                  <span>R$ {remainingAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Lembre-se:</strong> O valor restante de R$ {remainingAmount.toFixed(2)} deverá 
                  ser pago diretamente no restaurante no momento da refeição.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <p><strong>Chegada:</strong> Recomendamos chegar 10 minutos antes do horário reservado</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <p><strong>Tolerância:</strong> A mesa será liberada após 15 minutos de atraso</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <p><strong>Cancelamento:</strong> Até 1 hora antes com reembolso total</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <p><strong>Documento:</strong> Apresente um documento com foto na chegada</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Código da Reserva:</strong> {reservation.id.toUpperCase()}
                  <br />
                  Guarde este código para apresentar no restaurante ou para consultas futuras.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p>(11) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p>contato@restaureserva.com</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Nossa equipe está disponível para esclarecer dúvidas sobre sua reserva.
              </p>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1 gap-2">
              <Home className="h-4 w-4" />
              Nova Reserva
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()} 
              className="flex-1"
            >
              Imprimir Comprovante
            </Button>
          </div>
          
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Obrigado por escolher o RestauReserva! 
              <br />
              Aguardamos você para uma experiência gastronômica inesquecível.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}