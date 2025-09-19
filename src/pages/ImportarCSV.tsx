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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ImportarCSV() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<{
    sucesso: number;
    erro: number;
    detalhes: Array<{ linha: number; erro: string }>;
  } | null>(null);
  const { toast } = useToast();

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
    
    try {
      const text = await arquivo.text();
      const linhas = text.split('\n');
      const cabecalho = linhas[0].split(';');
      
      let sucesso = 0;
      let erro = 0;
      const detalhes: Array<{ linha: number; erro: string }> = [];
      
      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (!linha) continue;
        
        try {
          const valores = linha.split(';');
          const dados: Record<string, string> = {};
          
          cabecalho.forEach((campo, index) => {
            dados[campo] = valores[index] || '';
          });
          
          // Validações básicas
          if (!dados.NOME) {
            throw new Error('Nome é obrigatório');
          }
          if (!dados.VL_TITULO && !dados.VL_SALDO) {
            throw new Error('Valor do título é obrigatório');
          }
          if (!dados.DT_VENCIMENTO) {
            throw new Error('Data de vencimento é obrigatória');
          }
          
          // Converter data do formato DD/MM/AAAA para AAAA-MM-DD
          const converterData = (dataStr: string) => {
            if (!dataStr) return null;
            const partes = dataStr.split('/');
            if (partes.length === 3) {
              return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
            }
            return dataStr;
          };
          
          // Preparar dados para inserção
          const titulo = {
            numero_titulo: dados.COD_TITULO || `AUTO-${Date.now()}-${i}`,
            cliente_nome: dados.NOME,
            cliente_documento: dados.CNPJ_CPF || null,
            cliente_email: dados.EMAIL || null,
            cliente_telefone: dados['FONE 1'] || null,
            descricao: dados.DADOS_ADICIONAIS || null,
            valor: parseFloat((dados.VL_TITULO || dados.VL_SALDO || '0').replace(',', '.')),
            data_vencimento: converterData(dados.DT_VENCIMENTO),
            data_emissao: converterData(dados.DT_GERACAO) || new Date().toISOString().split('T')[0],
            status: 'pendente' as const
          };
          
          const { error } = await supabase
            .from('titulos')
            .insert(titulo);
          
          if (error) {
            throw new Error(error.message);
          }
          
          sucesso++;
        } catch (err) {
          erro++;
          detalhes.push({ 
            linha: i + 1, 
            erro: err instanceof Error ? err.message : 'Erro desconhecido' 
          });
        }
      }
      
      setResultado({ sucesso, erro, detalhes });
      
      if (sucesso > 0) {
        toast({
          title: "Importação concluída",
          description: `${sucesso} títulos importados com sucesso.`,
        });
      }
      
    } catch (err) {
      toast({
        title: "Erro na importação",
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const baixarModelo = () => {
    const a = document.createElement('a');
    a.href = '/modelo_importacao.csv';
    a.download = 'modelo_importacao.csv';
    a.click();
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
                  <Badge variant="outline">NOME</Badge>
                  <Badge variant="outline">VL_TITULO</Badge>
                  <Badge variant="outline">DT_VENCIMENTO</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground">Campos opcionais:</h4>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary">COD_TITULO</Badge>
                  <Badge variant="secondary">CNPJ_CPF</Badge>
                  <Badge variant="secondary">EMAIL</Badge>
                  <Badge variant="secondary">FONE 1</Badge>
                  <Badge variant="secondary">DT_GERACAO</Badge>
                  <Badge variant="secondary">DADOS_ADICIONAIS</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft">
            <h3 className="font-semibold text-foreground mb-4">Dicas</h3>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Use vírgula como separador decimal (ex: 1250,50)</p>
              <p>• Data no formato DD/MM/AAAA (ex: 15/01/2024)</p>
              <p>• Separador de campos: ponto e vírgula (;)</p>
              <p>• Codificação UTF-8 para caracteres especiais</p>
              <p>• Máximo de 1000 linhas por importação</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}