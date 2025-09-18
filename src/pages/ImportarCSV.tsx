import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  X,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ImportarCSV() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<{
    sucesso: number;
    erro: number;
    detalhes: Array<{ linha: number; erro: string }>;
  } | null>(null);

  const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArquivo(file);
      setResultado(null);
    }
  };

  const processarCSV = async () => {
    if (!arquivo) return;
    
    setCarregando(true);
    
    // Simular processamento
    setTimeout(() => {
      setResultado({
        sucesso: 15,
        erro: 2,
        detalhes: [
          { linha: 3, erro: "Valor inválido: 'abc'" },
          { linha: 8, erro: "Data de vencimento no formato incorreto" }
        ]
      });
      setCarregando(false);
    }, 2000);
  };

  const baixarModelo = () => {
    // Simular download do modelo CSV
    const csvContent = "cliente,documento,email,valor,vencimento,descricao\nJoão Silva,12345678901,joao@email.com,1250.00,2024-01-15,Serviços de consultoria\nMaria Santos,98765432100,maria@email.com,850.00,2024-01-20,Desenvolvimento de website";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo-titulos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
            <h1 className="text-3xl font-bold text-foreground">Importar CSV</h1>
            <p className="text-muted-foreground mt-1">Importe títulos e baixas via arquivo CSV</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instruções */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">Como importar</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center mt-0.5">1</div>
                <div>
                  <h3 className="font-medium text-foreground">Baixe o modelo CSV</h3>
                  <p className="text-sm text-muted-foreground">Use nosso modelo com os campos obrigatórios</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center mt-0.5">2</div>
                <div>
                  <h3 className="font-medium text-foreground">Preencha os dados</h3>
                  <p className="text-sm text-muted-foreground">Complete o arquivo com os dados dos títulos</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center mt-0.5">3</div>
                <div>
                  <h3 className="font-medium text-foreground">Faça o upload</h3>
                  <p className="text-sm text-muted-foreground">Selecione o arquivo e clique em processar</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={baixarModelo} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Baixar Modelo CSV
              </Button>
            </div>
          </Card>

          {/* Upload */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload do Arquivo</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arquivo">Arquivo CSV</Label>
                <Input 
                  id="arquivo"
                  type="file"
                  accept=".csv"
                  onChange={handleArquivo}
                />
              </div>

              {arquivo && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Arquivo selecionado: <strong>{arquivo.name}</strong> ({(arquivo.size / 1024).toFixed(1)} KB)
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={processarCSV}
                disabled={!arquivo || carregando}
                className="bg-gradient-primary shadow-glow"
              >
                {carregando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Processar CSV
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Resultado */}
          {resultado && (
            <Card className="p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground mb-4">Resultado da Importação</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-success font-medium">{resultado.sucesso} importados</span>
                  </div>
                  {resultado.erro > 0 && (
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5 text-destructive" />
                      <span className="text-destructive font-medium">{resultado.erro} com erro</span>
                    </div>
                  )}
                </div>

                {resultado.detalhes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground">Erros encontrados:</h3>
                    {resultado.detalhes.map((detalhe, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Linha {detalhe.linha}:</strong> {detalhe.erro}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar - Informações */}
        <div className="space-y-6">
          <Card className="p-6 shadow-soft">
            <h3 className="font-semibold text-foreground mb-4">Formato do CSV</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground">Campos obrigatórios:</h4>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline">cliente</Badge>
                  <Badge variant="outline">valor</Badge>
                  <Badge variant="outline">vencimento</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground">Campos opcionais:</h4>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary">documento</Badge>
                  <Badge variant="secondary">email</Badge>
                  <Badge variant="secondary">descricao</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft">
            <h3 className="font-semibold text-foreground mb-4">Dicas</h3>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Use ponto como separador decimal (ex: 1250.50)</p>
              <p>• Data no formato AAAA-MM-DD (ex: 2024-01-15)</p>
              <p>• Codificação UTF-8 para caracteres especiais</p>
              <p>• Máximo de 1000 linhas por importação</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}