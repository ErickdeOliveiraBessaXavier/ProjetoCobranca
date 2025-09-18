import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { 
  CalendarIcon, 
  Download, 
  TrendingUp, 
  DollarSign,
  Receipt,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Relatorios() {
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();

  // Mock data para o relatório
  const dadosRelatorio = {
    totalFaturado: { value: "R$ 45.230,50", subtitle: "no período selecionado" },
    totalRecebido: { value: "R$ 38.150,30", subtitle: "pagamentos confirmados" },
    titulosGerados: { value: "156", subtitle: "títulos criados" },
    inadimplencia: { value: "15.6%", subtitle: "taxa de inadimplência" }
  };

  const dadosPorMes = [
    { mes: "Janeiro", faturado: 45230.50, recebido: 38150.30, pendente: 7080.20 },
    { mes: "Dezembro", faturado: 52840.80, recebido: 48200.90, pendente: 4639.90 },
    { mes: "Novembro", faturado: 38950.20, recebido: 35840.10, pendente: 3110.10 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground mt-1">Análise detalhada do sistema de cobranças</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <Card className="p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">Filtros</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Período</label>
                <Select defaultValue="mes-atual">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes-atual">Mês atual</SelectItem>
                    <SelectItem value="mes-anterior">Mês anterior</SelectItem>
                    <SelectItem value="trimestre">Último trimestre</SelectItem>
                    <SelectItem value="ano">Ano atual</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Data Início</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataInicio}
                      onSelect={setDataInicio}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Data Fim</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataFim}
                      onSelect={setDataFim}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button className="w-full bg-gradient-primary shadow-glow">
                Gerar Relatório
              </Button>

              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </Card>
        </div>

        {/* Conteúdo do Relatório */}
        <div className="lg:col-span-3 space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Total Faturado"
              value={dadosRelatorio.totalFaturado.value}
              subtitle={dadosRelatorio.totalFaturado.subtitle}
              icon={DollarSign}
              variant="success"
              trend={{ value: "12.5%", positive: true }}
            />
            <MetricCard
              title="Total Recebido"
              value={dadosRelatorio.totalRecebido.value}
              subtitle={dadosRelatorio.totalRecebido.subtitle}
              icon={TrendingUp}
              variant="success"
              trend={{ value: "8.2%", positive: true }}
            />
            <MetricCard
              title="Títulos Gerados"
              value={dadosRelatorio.titulosGerados.value}
              subtitle={dadosRelatorio.titulosGerados.subtitle}
              icon={Receipt}
              trend={{ value: "18%", positive: true }}
            />
            <MetricCard
              title="Taxa de Inadimplência"
              value={dadosRelatorio.inadimplencia.value}
              subtitle={dadosRelatorio.inadimplencia.subtitle}
              icon={AlertCircle}
              variant="warning"
              trend={{ value: "2.1%", positive: false }}
            />
          </div>

          {/* Relatório Mensal */}
          <Card className="shadow-soft">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Resumo por Mês</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dadosPorMes.map((dados, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/50">
                    <div>
                      <h3 className="font-semibold text-foreground">{dados.mes}</h3>
                      <p className="text-sm text-muted-foreground">Resumo do mês</p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">Faturado</p>
                        <p className="font-semibold text-foreground">
                          {dados.faturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Recebido</p>
                        <p className="font-semibold text-success">
                          {dados.recebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pendente</p>
                        <p className="font-semibold text-warning">
                          {dados.pendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}