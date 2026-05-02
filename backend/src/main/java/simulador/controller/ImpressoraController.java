package simulador.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import simulador.model.Processo;
import simulador.model.ResultadoSimulacao;
import simulador.service.EscalonamentoService;

import java.util.List;

@RestController
@RequestMapping("/api/impressora")
public class ImpressoraController {

    private final EscalonamentoService service;

    public ImpressoraController(EscalonamentoService service) {
        this.service = service;
    }

    @PostMapping("/sjf")
    public ResultadoSimulacao executarSJF(@RequestBody RequisicaoSJF requisicao) {
        return service.executarSJF(
                requisicao.getProcessos(),
                requisicao.getTempoCicloCpu()
        );
    }

    @PostMapping("/multiplas-filas")
    public ResultadoSimulacao executarMultiplasFilas(@RequestBody RequisicaoMultiplasFilas requisicao) {
        return service.executarMultiplasFilas(
                requisicao.getProcessos(),
                requisicao.getTempoInicial(),
                requisicao.getTempoCicloCpu()
        );
    }

    public static class RequisicaoSJF {
        private List<Processo> processos;
        private int tempoCicloCpu;

        public List<Processo> getProcessos() {
            return processos;
        }

        public int getTempoCicloCpu() {
            return tempoCicloCpu;
        }

        public void setProcessos(List<Processo> processos) {
            this.processos = processos;
        }

        public void setTempoCicloCpu(int tempoCicloCpu) {
            this.tempoCicloCpu = tempoCicloCpu;
        }
    }

    public static class RequisicaoMultiplasFilas {
        private List<Processo> processos;
        private int tempoInicial;
        private int tempoCicloCpu;

        public List<Processo> getProcessos() {
            return processos;
        }

        public int getTempoInicial() {
            return tempoInicial;
        }

        public int getTempoCicloCpu() {
            return tempoCicloCpu;
        }

        public void setProcessos(List<Processo> processos) {
            this.processos = processos;
        }

        public void setTempoInicial(int tempoInicial) {
            this.tempoInicial = tempoInicial;
        }

        public void setTempoCicloCpu(int tempoCicloCpu) {
            this.tempoCicloCpu = tempoCicloCpu;
        }
    }
}