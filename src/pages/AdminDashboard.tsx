import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/useApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { Switch } from '@/components/ui/switch';
import { 
  // Navigation
  Home,
  Package, 
  Users, 
  ShoppingCart, 
  MessageSquare,
  BarChart3,
  Settings,
  Globe,
  
  // Actions
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  
  // UI Elements
  Bell,
  Grid3X3,
  ChevronDown,
  ChevronRight,
  Menu,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  
  // E-commerce specific
  Wallet,
  Building,
  CreditCard,
  Truck,
  Tag,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
  Shield,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  ShoppingBag,
  DollarSign,
  Percent,
  Gift,
  Target,
  Users2,
  Settings2,
  Palette,
  BellRing,
  Zap,
  Lightbulb,
  Moon,
  Sun
} from 'lucide-react';

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { state } = useApp();
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeframe, setTimeframe] = useState('month');

  // Vérifier l'accès admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  // Données simulées pour le dashboard
  const dashboardData = {
    totalRevenue: 125000,
    totalOrders: 2847,
    totalCustomers: 1247,
    totalProducts: 156,
    revenueChange: 12.5,
    ordersChange: 8.2,
    customersChange: 15.7,
    productsChange: -2.3,
    topProducts: [
      { name: 'Nettoyant Multi-Surfaces', sales: 234, revenue: 42120, growth: 15.2 },
      { name: 'Désinfectant Premium', sales: 189, revenue: 28350, growth: 8.7 },
      { name: 'Lave-Vitres Pro', sales: 156, revenue: 31200, growth: 22.1 }
    ],
    recentOrders: [
      { id: 'DRN-001', customer: 'Ahmed Bennani', amount: 285.50, status: 'completed', date: '2024-01-15' },
      { id: 'DRN-002', customer: 'Fatima Alaoui', amount: 189.99, status: 'processing', date: '2024-01-15' },
      { id: 'DRN-003', customer: 'Mohammed Tazi', amount: 456.75, status: 'shipped', date: '2024-01-14' }
    ]
  };

  // Configuration des sections de la sidebar
  const sidebarSections = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      active: true
    },
    {
      id: 'products',
      label: 'Produits',
      icon: Package,
      subsections: [
        { id: 'manage', label: 'Gestion', icon: Package },
        { id: 'add', label: 'Ajouter', icon: Plus },
        { id: 'import', label: 'Import/Export', icon: Upload },
        { id: 'categories', label: 'Catégories', icon: Tag }
      ]
    },
    {
      id: 'customers',
      label: 'Comptes',
      icon: Users,
      subsections: [
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'admins', label: 'Administrateurs', icon: Shield },
        { id: 'loyalty', label: 'Fidélité', icon: Star }
      ]
    },
    {
      id: 'orders',
      label: 'Commandes',
      icon: ShoppingCart,
      subsections: [
        { id: 'pending', label: 'En cours', icon: Clock },
        { id: 'completed', label: 'Terminées', icon: CheckCircle },
        { id: 'cancelled', label: 'Annulées', icon: XCircle },
        { id: 'shipping', label: 'Livraison', icon: Truck }
      ]
    },
    {
      id: 'support',
      label: 'Support Client',
      icon: MessageSquare,
      subsections: [
        { id: 'chat', label: 'Chat en direct', icon: MessageCircle },
        { id: 'tickets', label: 'Tickets', icon: FileText },
        { id: 'emails', label: 'Emails', icon: Mail }
      ]
    },
    {
      id: 'analytics',
      label: 'Statistiques',
      icon: BarChart3,
      subsections: [
        { id: 'sales', label: 'Ventes', icon: TrendingUp },
        { id: 'orders', label: 'Commandes', icon: ShoppingBag },
        { id: 'customers', label: 'Clients', icon: Users2 },
        { id: 'traffic', label: 'Trafic', icon: Activity }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Target,
      subsections: [
        { id: 'promotions', label: 'Promotions', icon: Gift },
        { id: 'campaigns', label: 'Campagnes', icon: Zap },
        { id: 'social', label: 'Réseaux sociaux', icon: Globe }
      ]
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      subsections: [
        { id: 'payments', label: 'Paiements', icon: CreditCard },
        { id: 'shipping', label: 'Expédition', icon: Truck },
        { id: 'taxes', label: 'Taxes', icon: Percent },
        { id: 'appearance', label: 'Apparence', icon: Palette }
      ]
    }
  ];

  const renderSidebar = () => (
    <div className={`bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} h-screen overflow-y-auto`}>
      {/* Header de la sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            {!sidebarCollapsed && <span className="text-xl font-bold text-gray-800 dark:text-white">DarnaClean</span>}
          </div>
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link to="/" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarSections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => {
                if (section.subsections) {
                  setActiveSection(activeSection === section.id ? '' : section.id);
                  setActiveSubSection('');
                } else {
                  setActiveSection(section.id);
                  setActiveSubSection('');
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <section.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span>{section.label}</span>}
              </div>
              {section.subsections && !sidebarCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === section.id ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Sous-sections */}
            {section.subsections && activeSection === section.id && !sidebarCollapsed && (
              <div className="ml-6 mt-2 space-y-1">
                {section.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    onClick={() => setActiveSubSection(subsection.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSubSection === subsection.id 
                        ? 'bg-emerald-100 dark:bg-emerald-800/30 text-emerald-800 dark:text-emerald-300' 
                        : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <subsection.icon className="w-4 h-4" />
                    <span>{subsection.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  const renderHeader = () => (
    <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
       <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 pr-4 w-80 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
          </button>
          
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.first_name?.charAt(0) || 'A'}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Administrateur</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="p-6 space-y-6">
      {/* En-tête du dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
          <p className="text-gray-600 dark:text-gray-400">Bienvenue, {user?.first_name} ! Voici un aperçu de votre boutique.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Chiffre d'affaires</p>
                <p className="text-3xl font-bold">{(dashboardData.totalRevenue / 1000).toFixed(0)}k MAD</p>
                <div className="flex items-center space-x-2 mt-2">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">{dashboardData.revenueChange}%</span>
                </div>
              </div>
              <Wallet className="w-12 h-12 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Commandes</p>
                <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">{dashboardData.ordersChange}%</span>
                </div>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Clients</p>
                <p className="text-3xl font-bold">{dashboardData.totalCustomers}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">{dashboardData.customersChange}%</span>
                </div>
              </div>
              <Users className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Produits</p>
                <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-sm">{Math.abs(dashboardData.productsChange)}%</span>
                </div>
              </div>
              <Package className="w-12 h-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des ventes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Évolution des ventes</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">+12.5%</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-end justify-between h-full space-x-1">
                  {[65, 80, 45, 90, 70, 85, 60, 75, 50, 88, 72, 95].map((height, index) => (
                    <div
                      key={index}
                      className="bg-emerald-500 rounded-t transition-all hover:bg-emerald-600"
                      style={{ height: `${height}%`, width: '8%' }}
                    ></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produits les plus vendus */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Produits populaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sales} ventes</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{product.revenue.toLocaleString()} MAD</div>
                    <div className="text-xs text-green-600">+{product.growth}%</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Commandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Commandes récentes</span>
            <Button variant="outline" size="sm">
              Voir toutes
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-gray-600">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{order.amount.toFixed(2)} MAD</div>
                  <Badge 
                    variant={
                      order.status === 'completed' ? 'default' : 
                      order.status === 'processing' ? 'secondary' : 'destructive'
                    }
                  >
                    {order.status === 'completed' ? 'Terminée' : 
                     order.status === 'processing' ? 'En cours' : 'Annulée'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'products':
        return <ProductManagement />;
      case 'customers':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gestion des comptes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Clients</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Gérer la base clients</p>
                  <Button className="w-full">Gérer</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Administrateurs</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Gérer les rôles et permissions</p>
                  <Button className="w-full">Gérer</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Programme de fidélité</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Gérer les récompenses</p>
                  <Button className="w-full">Gérer</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {sidebarSections.find(s => s.id === activeSection)?.label || 'Section'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cette section est en cours de développement...
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        {renderHeader()}
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}
