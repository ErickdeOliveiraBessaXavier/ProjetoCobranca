import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download,
  MoreHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Titulos() {
  // Mock data - será substituído por dados do Supabase
  const titulos = [
    {
      id: "TIT-001",
      cliente: "João Silva",
      valor: "R$ 1.250,00",
      vencimento: "2024-01-15",
      emissao: "2023-12-15",
      status: "pago",
      descricao: "Serviços de consultoria"
    },
    {
      id: "TIT-002", 
      cliente: "Maria Santos",
      valor: "R$ 850,00",
      vencimento: "2024-01-20",
      emissao: "2023-12-20",
      status: "pendente",
      descricao: "Desenvolvimento de website"
    },
    {
      id: "TIT-003",
      cliente: "Pedro Costa", 
      valor: "R$ 2.100,00",
      vencimento: "2024-01-10",
      emissao: "2023-12-10",
      status: "vencido",
      descricao: "Licença de software anual"
    },
    {
      id: "TIT-004",
      cliente: "Ana Oliveira",
      valor: "R$ 750,00", 
      vencimento: "2024-01-25",
      emissao: "2023-12-25",
      status: "pendente",
      descricao: "Manutenção mensal"
    },
    {
      id: "TIT-005",
      cliente: "Carlos Santos",
      valor: "R$ 1.800,00",
      vencimento: "2024-02-01", 
      emissao: "2024-01-01",
      status: "pendente",
      descricao: "Treinamento corporativo"
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pago": return "success";
      case "vencido": return "destructive";
      case "pendente": return "secondary";
      default: return "secondary";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Títulos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os títulos do sistema</p>
        </div>
        <Button asChild className="bg-gradient-primary shadow-glow">
          <Link to="/titulos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Título
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-6 shadow-soft">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por cliente, ID ou descrição..." 
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Títulos */}
      <Card className="shadow-soft">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {titulos.length} títulos encontrados
          </h2>
        </div>
        
        <div className="divide-y divide-border">
          {titulos.map((titulo) => (
            <div key={titulo.id} className="p-6 hover:bg-accent/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-foreground">{titulo.id}</span>
                    <Badge variant={getStatusVariant(titulo.status)}>
                      {getStatusLabel(titulo.status)}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium text-foreground mb-1">{titulo.cliente}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{titulo.descricao}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Emissão: {titulo.emissao}</span>
                    <span>Vencimento: {titulo.vencimento}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground mb-2">{titulo.valor}</p>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como pago</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}