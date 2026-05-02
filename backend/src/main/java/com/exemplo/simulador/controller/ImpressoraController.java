package main.java.com.example.simulador.controller;

import com.exemple.simulador.model.Processo;
import com.exemple.simulador.model.ResultadoSimulacao;
import com.exemple.simulador.service.EscalonamentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/impressora")
public class ImpressoraController {

    private final EscalonamentoService service;

    public ImpressoraController(EscalonamentoService service) {
        this.service = service;
    }

    @PostMapping("/sjf")
    public ResultadoSimulacao executarSJF(@RequestBody List<Processo> processos) {
        return service.executarSJF(processos);
    }

    @PostMapping("/round-robin")
    public ResultadoSimulacao executarRoundRobin(@RequestBody RequisicaoRoundRobin requisicao) {
        return service.executarRoundRobin(
                requisicao.getProcessos(),
                requisicao.getQuantum(),
                requisicao.getTempoInicial()
        );
    }

    public static class RequisicaoRoundRobin {
        private List<Processo> processos;
        private int quantum;
        private int tempoInicial;

        public List<Processo> getProcessos() {
            return processos;
        }

        public int getQuantum() {
            return quantum;
        }

        public int getTempoInicial() {
            return tempoInicial;
        }

        public void setProcessos(List<Processo> processos) {
            this.processos = processos;
        }

        public void setQuantum(int quantum) {
            this.quantum = quantum;
        }

        public void setTempoInicial(int tempoInicial) {
            this.tempoInicial = tempoInicial;
        }
    }
}