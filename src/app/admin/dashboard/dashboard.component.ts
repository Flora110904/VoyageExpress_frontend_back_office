import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceApi } from '../../services/user.service';
import { CompagnieServiceApi } from '../../services/compagnie.service';
import { EtablissementServiceApi } from '../../services/etablissement.service';
import { ReservationServiceApi } from '../../services/reservation.service';
import { ItineraireServiceApi } from '../../services/itineraire.service';
import { VehiculeServiceApi } from '../../services/vehicule.service';
import { TypeCompagnie } from '../../models/enums.model';
import { forkJoin } from 'rxjs';

interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  bgColor: string;
}

interface RecentActivity {
  type: string;
  description: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: StatCard[] = [];

  recentActivities: RecentActivity[] = [
    {
      type: 'user',
      description: 'Nouvel utilisateur enregistré: Marie Dupont',
      time: 'Il y a 5 minutes',
      icon: '👤'
    },
    {
      type: 'booking',
      description: 'Nouvelle réservation de vol pour Paris',
      time: 'Il y a 15 minutes',
      icon: '✈️'
    },
    {
      type: 'company',
      description: 'Air Sénégal a ajouté 3 nouveaux vols',
      time: 'Il y a 1 heure',
      icon: '🛫'
    },
    {
      type: 'hotel',
      description: 'Nouveau partenaire: Hôtel Terrou-Bi',
      time: 'Il y a 2 heures',
      icon: '🏨'
    },
    {
      type: 'bus',
      description: 'Station Ndiaga Ndiaye mise à jour',
      time: 'Il y a 3 heures',
      icon: '🚌'
    }
  ];

  topCompanies = [
    { name: 'Air Sénégal', bookings: 1245, revenue: '12.5M FCFA', logo: '✈️' },
    { name: 'Brussels Airlines', bookings: 987, revenue: '9.8M FCFA', logo: '🛫' },
    { name: 'Air France', bookings: 856, revenue: '8.9M FCFA', logo: '🇫🇷' },
    { name: 'Turkish Airlines', bookings: 743, revenue: '7.4M FCFA', logo: '🇹🇷' },
    { name: 'Royal Air Maroc', bookings: 621, revenue: '6.2M FCFA', logo: '🇲🇦' }
  ];

  bookingTrends = [
    { month: 'Jan', vols: 1200, bus: 800, hotels: 600 },
    { month: 'Fév', vols: 1400, bus: 900, hotels: 700 },
    { month: 'Mar', vols: 1800, bus: 1100, hotels: 900 },
    { month: 'Avr', vols: 2200, bus: 1300, hotels: 1100 },
    { month: 'Mai', vols: 2600, bus: 1500, hotels: 1300 },
    { month: 'Jui', vols: 3000, bus: 1700, hotels: 1500 }
  ];

  constructor(
    private userService: UserServiceApi,
    private compagnieService: CompagnieServiceApi,
    private etablissementService: EtablissementServiceApi,
    private reservationService: ReservationServiceApi,
    private itineraireService: ItineraireServiceApi,
    private vehiculeService: VehiculeServiceApi
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    forkJoin({
      users: this.userService.list(),
      compagnies: this.compagnieService.list(),
      etablissements: this.etablissementService.list(),
      reservations: this.reservationService.list(),
      itineraires: this.itineraireService.list(),
      vehicules: this.vehiculeService.list()
    }).subscribe({
      next: (data) => {
        // Count airlines and stations
        const airlines = data.compagnies.filter(c => c.type === TypeCompagnie.AEROPORT).length;
        const stations = data.compagnies.filter(c => c.type === TypeCompagnie.STATION).length;
        
        // Count confirmed reservations
        const confirmedReservations = data.reservations.filter(r => r.statut === 'CONFIRMEE').length;

        // Update stats with real data
        this.stats = [
          {
            icon: '👥',
            label: 'Utilisateurs Total',
            value: data.users.length.toString(),
            change: `${data.users.length} actifs`,
            changeType: 'increase',
            bgColor: 'bg-blue-500'
          },
          {
            icon: '✈️',
            label: 'Compagnies Aériennes',
            value: airlines.toString(),
            change: `${data.vehicules.filter(v => v.type === 'AVION').length} avions`,
            changeType: 'increase',
            bgColor: 'bg-purple-500'
          },
          {
            icon: '🚌',
            label: 'Stations de Bus',
            value: stations.toString(),
            change: `${data.vehicules.filter(v => v.type === 'BUS').length} bus`,
            changeType: 'increase',
            bgColor: 'bg-green-500'
          },
          {
            icon: '🏨',
            label: 'Établissements',
            value: data.etablissements.length.toString(),
            change: `${data.etablissements.length} partenaires`,
            changeType: 'increase',
            bgColor: 'bg-orange-500'
          },
          {
            icon: '🎫',
            label: 'Réservations',
            value: data.reservations.length.toString(),
            change: `${confirmedReservations} confirmées`,
            changeType: 'increase',
            bgColor: 'bg-pink-500'
          },
          {
            icon: '🗺️',
            label: 'Itinéraires Actifs',
            value: data.itineraires.length.toString(),
            change: `${data.vehicules.length} véhicules`,
            changeType: 'increase',
            bgColor: 'bg-indigo-500'
          }
        ];

        // Update top companies with real data
        const companiesWithStats = data.compagnies
          .filter(c => c.type === TypeCompagnie.AEROPORT)
          .map(company => {
            const vehicleCount = data.vehicules.filter(v => v.compagnieId === company.trackingId).length;
            return {
              name: company.nom,
              bookings: vehicleCount * 100, // Estimate
              revenue: `${(vehicleCount * 2.5).toFixed(1)}M FCFA`,
              logo: '✈️'
            };
          })
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 5);
        
        if (companiesWithStats.length > 0) {
          this.topCompanies = companiesWithStats;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
        // Keep mock data on error
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    this.stats = [
      {
        icon: '👥',
        label: 'Utilisateurs Total',
        value: '0',
        change: 'Erreur chargement',
        changeType: 'decrease',
        bgColor: 'bg-blue-500'
      },
      {
        icon: '✈️',
        label: 'Compagnies Aériennes',
        value: '0',
        change: 'Erreur chargement',
        changeType: 'decrease',
        bgColor: 'bg-purple-500'
      },
      {
        icon: '🚌',
        label: 'Stations de Bus',
        value: '0',
        change: 'Erreur chargement',
        changeType: 'decrease',
        bgColor: 'bg-green-500'
      },
      {
        icon: '🏨',
        label: 'Établissements',
        value: '0',
        change: 'Erreur chargement',
        changeType: 'decrease',
        bgColor: 'bg-orange-500'
      },
      {
        icon: '🎫',
        label: 'Réservations',
        value: '0',
        change: 'Erreur chargement',
        changeType: 'decrease',
        bgColor: 'bg-pink-500'
      },
      {
        icon: '🗺️',
        label: 'Itinéraires',
        value: '0',
        change: 'Erreur chargement',
        changeType: 'decrease',
        bgColor: 'bg-indigo-500'
      }
    ];
  }

  getMaxValue(data: any[], key: string): number {
    return Math.max(...data.map(item => item[key]));
  }

  getBarHeight(value: number, max: number): number {
    return (value / max) * 100;
  }
}
