import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { User, Reservation } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBack?: () => void;
  reservation?: Reservation | null;
}

export function LoginPage({ onLogin, onBack, reservation }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock user data
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? 'João Silva' : formData.name || 'Novo Usuário',
      email: formData.email || 'joao@exemplo.com',
      phone: isLogin ? '(11) 99999-9999' : formData.phone || '(11) 99999-9999'
    };
    
    onLogin(userData);
  };

  const handleQuickRegister = () => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '(11) 98888-8888'
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {onBack && (
        <header className="border-b bg-card">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl">Finalizar Reserva</h1>
              <p className="text-sm text-muted-foreground">Entre ou crie sua conta para confirmar</p>
            </div>
          </div>
        </header>
      )}

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Resumo da Reserva */}
          {reservation && (
            <div className="order-2 lg:order-1">
              <h2 className="mb-4">Resumo da Reserva</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {reservation.restaurantName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Mesa</p>
                        <p>Mesa {reservation.tableNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pessoas</p>
                        <p>{reservation.seats} lugares</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data</p>
                        <p>{reservation.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Horário</p>
                        <p>{reservation.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Valor estimado:</span>
                    <span>R$ {reservation.paymentAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Formulário de Login */}
          <div className={`${reservation ? 'order-1 lg:order-2' : 'w-full max-w-md mx-auto'}`}>
            {!reservation && (
              <div className="text-center mb-8">
                <h1 className="text-3xl mb-2">RestauReserva</h1>
                <p className="text-muted-foreground">Reserve sua mesa com facilidade</p>
              </div>
            )}
            
            <Card>
          <CardHeader className="text-center">
            <CardTitle>{isLogin ? 'Entrar' : 'Criar Conta'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Entre na sua conta para fazer reservas'
                : 'Crie uma conta para começar a reservar'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full">
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>
            
            <Separator />
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleQuickRegister}
              >
                Cadastro Rápido (Demo)
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
              </Button>
            </div>
          </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}