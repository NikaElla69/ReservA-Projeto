import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Star, Clock, Phone, Search, Filter } from 'lucide-react';
import { Restaurant } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RestaurantSelectionProps {
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Vista',
    cuisine: 'Italiana',
    description: 'Autêntica cozinha italiana com massas artesanais e vinhos selecionados',
    image: 'https://images.unsplash.com/photo-1556858878-1982c2ed1041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx8fDE3NTcxMTc3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    priceRange: 'R$ 80-120',
    location: 'Vila Madalena',
    openHours: '18:00 - 23:00',
    phone: '(11) 3456-7890',
    features: ['Romantic', 'Wine Bar', 'Outdoor Seating'],
    operatingDays: [2, 3, 4, 5, 6], // Terça a sábado
    closedDates: ['2024-12-25', '2024-01-01'] // Natal e Ano Novo
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    cuisine: 'Japonesa',
    description: 'Experiência gastronômica japonesa tradicional com peixes frescos importados',
    image: 'https://images.unsplash.com/photo-1743440164721-a3002bdca43b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx8fDE3NTcxMTc4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    priceRange: 'R$ 120-180',
    location: 'Liberdade',
    openHours: '19:00 - 22:30',
    phone: '(11) 2345-6789',
    features: ['Omakase', 'Premium', 'Sake Bar'],
    operatingDays: [1, 2, 3, 4, 5, 6], // Segunda a sábado
    closedDates: ['2024-12-25', '2024-12-31', '2024-01-01']
  },
  {
    id: '3',
    name: 'Churrascaria Tradição',
    cuisine: 'Brasileira',
    description: 'O melhor da carne brasileira com buffet de saladas e acompanhamentos',
    image: 'https://images.unsplash.com/photo-1721398624925-38dbb09fac27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx8fDE3NTcxMTc3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
    priceRange: 'R$ 70-100',
    location: 'Moema',
    openHours: '18:30 - 23:30',
    phone: '(11) 4567-8901',
    features: ['All You Can Eat', 'Family Friendly', 'Parking'],
    operatingDays: [0, 1, 2, 3, 4, 5, 6], // Todos os dias
    closedDates: ['2024-12-25']
  },
  {
    id: '4',
    name: 'Le Petit Bistro',
    cuisine: 'Francesa',
    description: 'Bistrô francês aconchegante com pratos clássicos e carta de vinhos especial',
    image: 'https://images.unsplash.com/photo-1556858878-1982c2ed1041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx8fDE3NTcxMTc3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    priceRange: 'R$ 90-150',
    location: 'Jardins',
    openHours: '19:00 - 24:00',
    phone: '(11) 5678-9012',
    features: ['Wine Pairing', 'Cozy', 'Chef\'s Table'],
    operatingDays: [3, 4, 5, 6, 0], // Quarta a domingo
    closedDates: ['2024-12-24', '2024-12-25', '2024-01-01']
  },
  {
    id: '5',
    name: 'Taco Libre',
    cuisine: 'Mexicana',
    description: 'Sabores autênticos do México com drinks especiais e ambiente descontraído',
    image: 'https://images.unsplash.com/photo-1721398624925-38dbb09fac27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx8fDE3NTcxMTc3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.4,
    priceRange: 'R$ 50-80',
    location: 'Pinheiros',
    openHours: '18:00 - 02:00',
    phone: '(11) 6789-0123',
    features: ['Happy Hour', 'Live Music', 'Cocktails'],
    operatingDays: [3, 4, 5, 6, 0], // Quarta a domingo
    closedDates: ['2024-12-25', '2024-01-01']
  },
  {
    id: '6',
    name: 'Vegetariano & Cia',
    cuisine: 'Vegetariana',
    description: 'Cozinha plant-based criativa com ingredientes orgânicos e locais',
    image: 'https://images.unsplash.com/photo-1743440164721-a3002bdca43b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx8fDE3NTcxMTc4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    priceRange: 'R$ 60-90',
    location: 'Vila Olímpia',
    openHours: '17:30 - 22:00',
    phone: '(11) 7890-1234',
    features: ['Organic', 'Vegan Options', 'Healthy'],
    operatingDays: [1, 2, 3, 4, 5], // Segunda a sexta
    closedDates: ['2024-12-23', '2024-12-24', '2024-12-25', '2024-12-30', '2024-12-31', '2024-01-01']
  }
];

const cuisineTypes = ['Todas', 'Italiana', 'Japonesa', 'Brasileira', 'Francesa', 'Mexicana', 'Vegetariana'];
const locations = ['Todas', 'Vila Madalena', 'Liberdade', 'Moema', 'Jardins', 'Pinheiros', 'Vila Olímpia'];

export function RestaurantSelection({ onRestaurantSelect }: RestaurantSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('Todas');
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === 'Todas' || restaurant.cuisine === selectedCuisine;
    const matchesLocation = selectedLocation === 'Todas' || restaurant.location === selectedLocation;
    
    return matchesSearch && matchesCuisine && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl mb-2">RestauReserva</h1>
            <p className="text-muted-foreground">Descubra e reserve sua mesa nos melhores restaurantes</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou tipo de cozinha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="flex gap-4 flex-wrap">
              <div className="min-w-40">
                <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de cozinha" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map(cuisine => (
                      <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-40">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(selectedCuisine !== 'Todas' || selectedLocation !== 'Todas') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCuisine('Todas');
                    setSelectedLocation('Todas');
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-background/90">
                    {restaurant.cuisine}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-background/90 px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{restaurant.rating}</span>
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{restaurant.name}</span>
                  <span className="text-sm text-muted-foreground">{restaurant.priceRange}</span>
                </CardTitle>
                <CardDescription>
                  {restaurant.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{restaurant.openHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {restaurant.features.map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button
                  onClick={() => onRestaurantSelect(restaurant)}
                  className="w-full"
                >
                  Ver Mesas Disponíveis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3>Nenhum restaurante encontrado</h3>
              <p className="text-muted-foreground mt-2">
                Tente ajustar seus filtros ou termo de busca para encontrar restaurantes disponíveis.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('Todas');
                  setSelectedLocation('Todas');
                }}
                className="mt-4"
              >
                Limpar Busca
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}