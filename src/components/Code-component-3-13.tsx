import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">RestauReserva</h1>
          <p className="text-muted-foreground">Reserve sua mesa com facilidade</p>
        </div>
        
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
  );
}