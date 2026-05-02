package src.main.simulador.service;

import  src.main.simulador.model.Processo;
import  src.main.simulador.model.ResultadoProcesso;
import  src.main.simulador.model.ResultadoSimulacao;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class EscalonamentoService {

    public ResultadoSimulacao executarSJF(List<Processo> processos) {
        int tempoAtual = 0;

        List<Processo> pendentes = new ArrayList<>(processos);
        List<ResultadoProcesso> resultados = new ArrayList<>();
        List<String> linhaDoTempo = new ArrayList<>();

        while (!pendentes.isEmpty()) {
            List<Processo> prontos = new ArrayList<>();

            for (Processo processo : pendentes) {
                if (processo.getTempoChegada() <= tempoAtual) {
                    prontos.add(processo);
                }
            }

            if (prontos.isEmpty()) {
                int menorChegada = pendentes.stream()
                        .mapToInt(Processo::getTempoChegada)
                        .min()
                        .orElse(tempoAtual);

                tempoAtual = menorChegada;
                continue;
            }

            Processo escolhido = prontos.stream()
                    .min(Comparator.comparingInt(Processo::getTempoCpu))
                    .orElseThrow();

            int inicio = tempoAtual;
            int conclusao = inicio + escolhido.getTempoCpu();

            int tempoVida = conclusao - escolhido.getTempoChegada();
            int tempoEspera = tempoVida - escolhido.getTempoCpu();

            resultados.add(new ResultadoProcesso(
                    escolhido.getNome(),
                    escolhido.getTempoChegada(),
                    escolhido.getTempoCpu(),
                    inicio,
                    conclusao,
                    tempoEspera,
                    tempoVida,
                    "SJF"
            ));

            linhaDoTempo.add(
                    escolhido.getNome() + " executou de " + inicio + " até " + conclusao
            );

            tempoAtual = conclusao;
            pendentes.remove(escolhido);
        }

        return new ResultadoSimulacao(
                "SJF Não-Preemptivo",
                linhaDoTempo,
                resultados,
                tempoAtual
        );
    }

    public ResultadoSimulacao executarMultiplasFilas(List<Processo> processos, int tempoInicial) {
        int tempoAtual = tempoInicial;
        int concluidos = 0;

        List<ProcessoInterno> lista = new ArrayList<>();

        for (Processo processo : processos) {
            lista.add(new ProcessoInterno(
                    processo.getNome(),
                    processo.getTempoChegada() + tempoInicial,
                    processo.getTempoCpu(),
                    processo.getFila()
            ));
        }

        List<ResultadoProcesso> resultados = new ArrayList<>();
        List<String> linhaDoTempo = new ArrayList<>();

        ProcessoInterno processoAnterior = null;
        int inicioBloco = tempoAtual;

        while (concluidos < lista.size()) {
            ProcessoInterno escolhido = escolherProcessoMultiplasFilas(lista, tempoAtual);

            if (escolhido == null) {
                if (processoAnterior != null) {
                    linhaDoTempo.add(
                            processoAnterior.nome + " (" + processoAnterior.fila + ") executou de "
                                    + inicioBloco + " até " + tempoAtual
                    );
                    processoAnterior = null;
                }

                tempoAtual++;
                inicioBloco = tempoAtual;
                continue;
            }

            if (escolhido.tempoInicio == -1) {
                escolhido.tempoInicio = tempoAtual;
            }

            if (processoAnterior != escolhido) {
                if (processoAnterior != null) {
                    linhaDoTempo.add(
                            processoAnterior.nome + " (" + processoAnterior.fila + ") executou de "
                                    + inicioBloco + " até " + tempoAtual
                    );
                }

                inicioBloco = tempoAtual;
                processoAnterior = escolhido;
            }

            escolhido.tempoRestante--;
            tempoAtual++;

            if (escolhido.tempoRestante == 0) {
                escolhido.tempoConclusao = tempoAtual;

                int tempoVida = escolhido.tempoConclusao - escolhido.tempoChegada;
                int tempoEspera = tempoVida - escolhido.tempoCpu;

                resultados.add(new ResultadoProcesso(
                        escolhido.nome,
                        escolhido.tempoChegada - tempoInicial,
                        escolhido.tempoCpu,
                        escolhido.tempoInicio,
                        escolhido.tempoConclusao,
                        tempoEspera,
                        tempoVida,
                        escolhido.fila
                ));

                concluidos++;
            }
        }

        if (processoAnterior != null) {
            linhaDoTempo.add(
                    processoAnterior.nome + " (" + processoAnterior.fila + ") executou de "
                            + inicioBloco + " até " + tempoAtual
            );
        }

        return new ResultadoSimulacao(
                "Múltiplas Filas Preemptivo",
                linhaDoTempo,
                resultados,
                tempoAtual
        );
    }

    private ProcessoInterno escolherProcessoMultiplasFilas(List<ProcessoInterno> processos, int tempoAtual) {
        ProcessoInterno escolhido = null;

        for (ProcessoInterno processo : processos) {
            if (processo.tempoChegada <= tempoAtual && processo.tempoRestante > 0) {
                if (escolhido == null) {
                    escolhido = processo;
                } else {
                    int prioridadeProcesso = prioridadeFila(processo.fila);
                    int prioridadeEscolhido = prioridadeFila(escolhido.fila);

                    if (prioridadeProcesso < prioridadeEscolhido) {
                        escolhido = processo;
                    } else if (prioridadeProcesso == prioridadeEscolhido
                            && processo.tempoRestante < escolhido.tempoRestante) {
                        escolhido = processo;
                    }
                }
            }
        }

        return escolhido;
    }

    private int prioridadeFila(String fila) {
        if (fila == null) {
            return 3;
        }

        return switch (fila.toLowerCase()) {
            case "urgente" -> 1;
            case "normal" -> 2;
            case "lote" -> 3;
            default -> 3;
        };
    }

    private static class ProcessoInterno {
        String nome;
        int tempoChegada;
        int tempoCpu;
        int tempoRestante;
        int tempoInicio = -1;
        int tempoConclusao;
        String fila;

        ProcessoInterno(String nome, int tempoChegada, int tempoCpu, String fila) {
            this.nome = nome;
            this.tempoChegada = tempoChegada;
            this.tempoCpu = tempoCpu;
            this.tempoRestante = tempoCpu;
            this.fila = fila;
        }
    }
}