import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Receipt, 
  DollarSign, 
  AlertCircle, 
  TrendingUp,
  Plus,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data - será substituído por dados do Supabase
  const metrics = {
    totalTitulos: { value: "1.247", subtitle: "títulos cadastrados" },
    valorTotal: { value: "R$ 85.420,50", subtitle: "valor total em aberto" },
    vencidos: { value: "23", subtitle: "títulos vencidos" },
    recebidos: { value: "R$ 12.850,30", subtitle: "recebido este mês" }
  };

  const recentTitulos = [
    { id: "001", cliente: "João Silva", valor: "R$ 1.250,00", vencimento: "2024-01-15", status: "pago" },
    { id: "002", cliente: "Maria Santos", valor: "R$ 850,00", vencimento: "2024-01-20", status: "pendente" },
    { id: "003", cliente: "Pedro Costa", valor: "R$ 2.100,00", vencimento: "2024-01-10", status: "vencido" },
    { id: "004", cliente: "Ana Oliveira", valor: "R$ 750,00", vencimento: "2024-01-25", status: "pendente" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago": return "text-success bg-success/10";
      case "vencido": return "text-destructive bg-destructive/10"; 
      case "pendente": return "text-warning bg-warning/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pago": return "Pago";
      case "vencido": return "Vencido";
      case "pendente": return "Pendente";
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do sistema de cobranças</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/importar">
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV
            </Link>
          </Button>
          <Button asChild className="bg-gradient-primary shadow-glow">
            <Link to="/titulos/novo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Título
            </Link>
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Títulos"
          value={metrics.totalTitulos.value}
          subtitle={metrics.totalTitulos.subtitle}
          icon={Receipt}
          trend={{ value: "12%", positive: true }}
        />
        <MetricCard
          title="Valor Total"
          value={metrics.valorTotal.value}
          subtitle={metrics.valorTotal.subtitle}
          icon={DollarSign}
          variant="success"
          trend={{ value: "8.5%", positive: true }}
        />
        <MetricCard
          title="Títulos Vencidos"
          value={metrics.vencidos.value}
          subtitle={metrics.vencidos.subtitle}
          icon={AlertCircle}
          variant="destructive"
          trend={{ value: "2.1%", positive: false }}
        />
        <MetricCard
          title="Recebido no Mês"
          value={metrics.recebidos.value}
          subtitle={metrics.recebidos.subtitle}
          icon={TrendingUp}
          variant="success"
          trend={{ value: "15.2%", positive: true }}
        />
      </div>

      {/* Títulos Recentes */}
      <Card className="shadow-soft">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Títulos Recentes</h2>
            <Button asChild variant="ghost">
              <Link to="/titulos">Ver todos</Link>
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentTitulos.map((titulo) => (
              <div key={titulo.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="font-medium text-foreground">{titulo.cliente}</p>
                    <p className="text-sm text-muted-foreground">ID: {titulo.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{titulo.valor}</p>
                  <p className="text-sm text-muted-foreground">Venc: {titulo.vencimento}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(titulo.status)}`}>
                  {getStatusLabel(titulo.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}