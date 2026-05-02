package simulador.model;

import java.util.List;

public class ResultadoSimulacao {

    private String algoritmo;
    private List<String> linhaDoTempo;
    private List<ResultadoProcesso> resultados;
    private int tempoFinal;
    private int tempoCicloCpu;

    public ResultadoSimulacao() {
    }

    public ResultadoSimulacao(String algoritmo, List<String> linhaDoTempo,
                              List<ResultadoProcesso> resultados,
                              int tempoFinal,
                              int tempoCicloCpu) {
        this.algoritmo = algoritmo;
        this.linhaDoTempo = linhaDoTempo;
        this.resultados = resultados;
        this.tempoFinal = tempoFinal;
        this.tempoCicloCpu = tempoCicloCpu;
    }

    public String getAlgoritmo() {
        return algoritmo;
    }

    public List<String> getLinhaDoTempo() {
        return linhaDoTempo;
    }

    public List<ResultadoProcesso> getResultados() {
        return resultados;
    }

    public int getTempoFinal() {
        return tempoFinal;
    }

    public int getTempoCicloCpu() {
        return tempoCicloCpu;
    }

    public void setAlgoritmo(String algoritmo) {
        this.algoritmo = algoritmo;
    }

    public void setLinhaDoTempo(List<String> linhaDoTempo) {
        this.linhaDoTempo = linhaDoTempo;
    }

    public void setResultados(List<ResultadoProcesso> resultados) {
        this.resultados = resultados;
    }

    public void setTempoFinal(int tempoFinal) {
        this.tempoFinal = tempoFinal;
    }

    public void setTempoCicloCpu(int tempoCicloCpu) {
        this.tempoCicloCpu = tempoCicloCpu;
    }
}