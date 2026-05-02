package src.main.simulador.controller;

import src.main.simulador.model.Processo;
import src.main.simulador.model.ResultadoSimulacao;
import src.main.simulador.service.EscalonamentoService;
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

    @PostMapping("/multiplas-filas")
    public ResultadoSimulacao executarMultiplasFilas(@RequestBody RequisicaoMultiplasFilas requisicao) {
        return service.executarMultiplasFilas(
                requisicao.getProcessos(),
                requisicao.getTempoInicial()
        );
    }

    public static class RequisicaoMultiplasFilas {
        private List<Processo> processos;
        private int tempoInicial;

        public List<Processo> getProcessos() {
            return processos;
        }

        public int getTempoInicial() {
            return tempoInicial;
        }

        public void setProcessos(List<Processo> processos) {
            this.processos = processos;
        }

        public void setTempoInicial(int tempoInicial) {
            this.tempoInicial = tempoInicial;
        }
    }
}