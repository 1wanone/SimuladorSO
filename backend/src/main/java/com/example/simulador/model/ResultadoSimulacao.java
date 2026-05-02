package main.java.com.example.simulador.model;

import java.util.List;

public class ResultadoSimulacao {

    private String algoritmo;
    private List<String> linhaDoTempo;
    private List<ResultadoProcesso> resultados;
    private int tempoFinal;

    public ResultadoSimulacao() {
    }

    public ResultadoSimulacao(String algoritmo, List<String> linhaDoTempo,
                              List<ResultadoProcesso> resultados, int tempoFinal) {
        this.algoritmo = algoritmo;
        this.linhaDoTempo = linhaDoTempo;
        this.resultados = resultados;
        this.tempoFinal = tempoFinal;
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
}