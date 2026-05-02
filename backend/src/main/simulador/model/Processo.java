package src.main.simulador.model;

public class Processo {

    private String nome;
    private int tempoChegada;
    private int tempoCpu;
    private String fila;

    public Processo() {
    }

    public Processo(String nome, int tempoChegada, int tempoCpu, String fila) {
        this.nome = nome;
        this.tempoChegada = tempoChegada;
        this.tempoCpu = tempoCpu;
        this.fila = fila;
    }

    public String getNome() {
        return nome;
    }

    public int getTempoChegada() {
        return tempoChegada;
    }

    public int getTempoCpu() {
        return tempoCpu;
    }

    public String getFila() {
        return fila;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setTempoChegada(int tempoChegada) {
        this.tempoChegada = tempoChegada;
    }

    public void setTempoCpu(int tempoCpu) {
        this.tempoCpu = tempoCpu;
    }

    public void setFila(String fila) {
        this.fila = fila;
    }
}