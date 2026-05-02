package main.java.com.example.simulador.service;

import com.exemplo.simulador.model.Processo;
import com.exemplo.simulador.model.ResultadoProcesso;
import com.exemplo.simulador.model.ResultadoSimulacao;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EscalonamentoService {

    public ResultadoSimulacao executarSJF(List<Processo> processos) {
        int tempoAtual = 0;

        List<Processo> pendentes = new ArrayList<>(processos);
        List<ResultadoProcesso> resultados = new ArrayList<>();
        List<String> linhaDoTempo = new ArrayList<>();

        while (!pendentes.isEmpty()) {
            List<Processo> prontos = new ArrayList<>();

            for (Processo p : pendentes) {
                if (p.getTempoChegada() <= tempoAtual) {
                    prontos.add(p);
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
                    tempoVida
            ));

            linhaDoTempo.add(escolhido.getNome() + " executou de " + inicio + " até " + conclusao);

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

    public ResultadoSimulacao executarRoundRobin(List<Processo> processos, int quantum, int tempoInicial) {
        int tempoAtual = tempoInicial;

        List<ProcessoInterno> lista = new ArrayList<>();

        for (Processo p : processos) {
            lista.add(new ProcessoInterno(
                    p.getNome(),
                    p.getTempoChegada() + tempoInicial,
                    p.getTempoCpu()
            ));
        }

        lista.sort(Comparator.comparingInt(p -> p.tempoChegada));

        Queue<ProcessoInterno> fila = new LinkedList<>();
        List<ResultadoProcesso> resultados = new ArrayList<>();
        List<String> linhaDoTempo = new ArrayList<>();

        int indice = 0;

        while (resultados.size() < lista.size()) {
            while (indice < lista.size() && lista.get(indice).tempoChegada <= tempoAtual) {
                fila.add(lista.get(indice));
                indice++;
            }

            if (fila.isEmpty()) {
                if (indice < lista.size()) {
                    tempoAtual = lista.get(indice).tempoChegada;
                }
                continue;
            }

            ProcessoInterno atual = fila.poll();

            if (atual.tempoInicio == -1) {
                atual.tempoInicio = tempoAtual;
            }

            int inicio = tempoAtual;
            int tempoExecutado = Math.min(quantum, atual.tempoRestante);

            tempoAtual += tempoExecutado;
            atual.tempoRestante -= tempoExecutado;

            int fim = tempoAtual;

            linhaDoTempo.add(atual.nome + " executou de " + inicio + " até " + fim);

            while (indice < lista.size() && lista.get(indice).tempoChegada <= tempoAtual) {
                fila.add(lista.get(indice));
                indice++;
            }

            if (atual.tempoRestante > 0) {
                fila.add(atual);
            } else {
                int conclusao = tempoAtual;
                int tempoVida = conclusao - atual.tempoChegada;
                int tempoEspera = tempoVida - atual.tempoCpu;

                resultados.add(new ResultadoProcesso(
                        atual.nome,
                        atual.tempoChegada - tempoInicial,
                        atual.tempoCpu,
                        atual.tempoInicio,
                        conclusao,
                        tempoEspera,
                        tempoVida
                ));
            }
        }

        return new ResultadoSimulacao(
                "Round Robin Preemptivo",
                linhaDoTempo,
                resultados,
                tempoAtual
        );
    }

    private static class ProcessoInterno {
        String nome;
        int tempoChegada;
        int tempoCpu;
        int tempoRestante;
        int tempoInicio = -1;

        ProcessoInterno(String nome, int tempoChegada, int tempoCpu) {
            this.nome = nome;
            this.tempoChegada = tempoChegada;
            this.tempoCpu = tempoCpu;
            this.tempoRestante = tempoCpu;
        }
    }
}