package main.java.com.example.simulador.model;

public class Processo {

    private String nome;
    private int tempoChegada;
    private int tempoCpu;

    public Processo() {
    }

    public Processo(String nome, int tempoChegada, int tempoCpu) {
        this.nome = nome;
        this.tempoChegada = tempoChegada;
        this.tempoCpu = tempoCpu;
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

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setTempoChegada(int tempoChegada) {
        this.tempoChegada = tempoChegada;
    }

    public void setTempoCpu(int tempoCpu) {
        this.tempoCpu = tempoCpu;
    }
}