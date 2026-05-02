package src.main.simulador.model;

public class ResultadoProcesso {

    private String nome;
    private int tempoChegada;
    private int tempoCpu;
    private int tempoInicio;
    private int tempoConclusao;
    private int tempoEspera;
    private int tempoVida;
    private String fila;

    public ResultadoProcesso() {
    }

    public ResultadoProcesso(String nome, int tempoChegada, int tempoCpu,
                             int tempoInicio, int tempoConclusao,
                             int tempoEspera, int tempoVida, String fila) {
        this.nome = nome;
        this.tempoChegada = tempoChegada;
        this.tempoCpu = tempoCpu;
        this.tempoInicio = tempoInicio;
        this.tempoConclusao = tempoConclusao;
        this.tempoEspera = tempoEspera;
        this.tempoVida = tempoVida;
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

    public int getTempoInicio() {
        return tempoInicio;
    }

    public int getTempoConclusao() {
        return tempoConclusao;
    }

    public int getTempoEspera() {
        return tempoEspera;
    }

    public int getTempoVida() {
        return tempoVida;
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

    public void setTempoInicio(int tempoInicio) {
        this.tempoInicio = tempoInicio;
    }

    public void setTempoConclusao(int tempoConclusao) {
        this.tempoConclusao = tempoConclusao;
    }

    public void setTempoEspera(int tempoEspera) {
        this.tempoEspera = tempoEspera;
    }

    public void setTempoVida(int tempoVida) {
        this.tempoVida = tempoVida;
    }

    public void setFila(String fila) {
        this.fila = fila;
    }
}