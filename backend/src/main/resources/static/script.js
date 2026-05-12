"use strict";

// ─── DADOS INICIAIS ──────────────────────────────────────────────────────────

const processosSJF = [
    { nome: "Doc1",  tempoChegada: 0, tempoCpu: 8 },
    { nome: "Doc2",  tempoChegada: 1, tempoCpu: 4 },
    { nome: "Doc3",  tempoChegada: 2, tempoCpu: 9 },
    { nome: "Doc4",  tempoChegada: 3, tempoCpu: 5 },
    { nome: "Doc5",  tempoChegada: 4, tempoCpu: 2 }
];

const processosMultiplas = [
    { nome: "Doc6",  tempoChegada: 0, tempoCpu: 7, fila: "normal"  },
    { nome: "Doc7",  tempoChegada: 1, tempoCpu: 4, fila: "lote"    },
    { nome: "Doc8",  tempoChegada: 2, tempoCpu: 3, fila: "urgente" },
    { nome: "Doc9",  tempoChegada: 3, tempoCpu: 6, fila: "normal"  },
    { nome: "Doc10", tempoChegada: 4, tempoCpu: 2, fila: "urgente" }
];

// ─── CRIAÇÃO DE INPUTS ───────────────────────────────────────────────────────

/**
 * @param {string} containerId
 * @param {{ nome: string, tempoChegada: number, tempoCpu: number }[]} processos
 */
function criarInputsSJF(containerId, processos) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    processos.forEach(function(processo, i) {
        const row = document.createElement("div");
        row.className = "processo";

        const inputNome = document.createElement("input");
        inputNome.type = "text";
        inputNome.value = processo.nome;
        inputNome.id = containerId + "-nome-" + i;

        const inputChegada = document.createElement("input");
        inputChegada.type = "number";
        inputChegada.min = "0";
        inputChegada.value = String(processo.tempoChegada);
        inputChegada.id = containerId + "-chegada-" + i;

        const inputCpu = document.createElement("input");
        inputCpu.type = "number";
        inputCpu.min = "1";
        inputCpu.value = String(processo.tempoCpu);
        inputCpu.id = containerId + "-cpu-" + i;

        row.appendChild(inputNome);
        row.appendChild(inputChegada);
        row.appendChild(inputCpu);
        container.appendChild(row);
    });
}

/**
 * @param {string} containerId
 * @param {{ nome: string, tempoChegada: number, tempoCpu: number, fila: string }[]} processos
 */
function criarInputsMultiplas(containerId, processos) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    processos.forEach(function(processo, i) {
        const row = document.createElement("div");
        row.className = "processo";

        const inputNome = document.createElement("input");
        inputNome.type = "text";
        inputNome.value = processo.nome;
        inputNome.id = containerId + "-nome-" + i;

        const inputChegada = document.createElement("input");
        inputChegada.type = "number";
        inputChegada.min = "0";
        inputChegada.value = String(processo.tempoChegada);
        inputChegada.id = containerId + "-chegada-" + i;

        const inputCpu = document.createElement("input");
        inputCpu.type = "number";
        inputCpu.min = "1";
        inputCpu.value = String(processo.tempoCpu);
        inputCpu.id = containerId + "-cpu-" + i;

        const select = document.createElement("select");
        select.id = containerId + "-fila-" + i;
        ["urgente", "normal", "lote"].forEach(function(valor) {
            const opt = document.createElement("option");
            opt.value = valor;
            opt.textContent = valor.charAt(0).toUpperCase() + valor.slice(1);
            if (valor === processo.fila) { opt.selected = true; }
            select.appendChild(opt);
        });

        row.appendChild(inputNome);
        row.appendChild(inputChegada);
        row.appendChild(inputCpu);
        row.appendChild(select);
        container.appendChild(row);
    });
}

// ─── LEITURA DE INPUTS ───────────────────────────────────────────────────────

/**
 * @param {string} containerId
 * @param {number} qtd
 * @returns {{ nome: string, tempoChegada: number, tempoCpu: number, fila: string }[]}
 */
function lerProcessosSJF(containerId, qtd) {
    const lista = [];
    for (let i = 0; i < qtd; i++) {
        lista.push({
            nome:         document.getElementById(containerId + "-nome-" + i).value,
            tempoChegada: Number(document.getElementById(containerId + "-chegada-" + i).value),
            tempoCpu:     Number(document.getElementById(containerId + "-cpu-" + i).value),
            fila:         "SJF"
        });
    }
    return lista;
}

/**
 * @param {string} containerId
 * @param {number} qtd
 * @returns {{ nome: string, tempoChegada: number, tempoCpu: number, fila: string }[]}
 */
function lerProcessosMultiplas(containerId, qtd) {
    const lista = [];
    for (let i = 0; i < qtd; i++) {
        lista.push({
            nome:         document.getElementById(containerId + "-nome-" + i).value,
            tempoChegada: Number(document.getElementById(containerId + "-chegada-" + i).value),
            tempoCpu:     Number(document.getElementById(containerId + "-cpu-" + i).value),
            fila:         document.getElementById(containerId + "-fila-" + i).value
        });
    }
    return lista;
}

// ─── EXECUÇÃO DA SIMULAÇÃO ───────────────────────────────────────────────────

async function executarSimulacao() {
    const btn = document.querySelector(".btn-run");
    btn.disabled = true;
    btn.textContent = "Calculando...";

    const filaSJF       = lerProcessosSJF("filaSJF", 5);
    const filaMultiplas = lerProcessosMultiplas("filaMultiplas", 5);
    const tempoCicloCpu = Number(document.getElementById("tempoCicloCpu").value);

    if (tempoCicloCpu <= 0) {
        alert("O tempo de ciclo de CPU deve ser maior que zero.");
        btn.disabled = false;
        btn.textContent = "Executar Simulação";
        return;
    }

    let resultadoSJF = null;
    let resultadoMultiplas = null;
    let erroOcorreu = false;

    try {
        const rSJF = await fetch("/api/impressora/sjf", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ processos: filaSJF, tempoCicloCpu: tempoCicloCpu })
        });

        if (!rSJF.ok) {
            erroOcorreu = true;
        } else {
            resultadoSJF = await rSJF.json();
        }
    } catch (e) {
        console.error("Erro na requisição SJF:", e);
        erroOcorreu = true;
    }

    if (!erroOcorreu && resultadoSJF !== null) {
        try {
            const rMult = await fetch("/api/impressora/multiplas-filas", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    processos:      filaMultiplas,
                    tempoInicial:   resultadoSJF.tempoFinal,
                    tempoCicloCpu:  tempoCicloCpu
                })
            });

            if (!rMult.ok) {
                erroOcorreu = true;
            } else {
                resultadoMultiplas = await rMult.json();
            }
        } catch (e) {
            console.error("Erro na requisição Múltiplas Filas:", e);
            erroOcorreu = true;
        }
    }

    btn.disabled = false;
    btn.textContent = "";
    const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    iconSvg.setAttribute("width", "13");
    iconSvg.setAttribute("height", "13");
    iconSvg.setAttribute("viewBox", "0 0 24 24");
    iconSvg.setAttribute("fill", "currentColor");
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("points", "5 3 19 12 5 21 5 3");
    iconSvg.appendChild(poly);
    btn.appendChild(iconSvg);
    btn.appendChild(document.createTextNode(" Executar Simulação"));

    if (erroOcorreu) {
        alert("Erro ao executar. Verifique se o back-end está rodando.");
        return;
    }

    mostrarResultado(resultadoSJF, resultadoMultiplas);
}

// ─── RENDERIZAÇÃO DOS RESULTADOS ─────────────────────────────────────────────

/**
 * @param {{ algoritmo: string, tempoFinal: number, tempoCicloCpu: number, linhaDoTempo: string[], resultados: object[] }} sjf
 * @param {{ algoritmo: string, tempoFinal: number, linhaDoTempo: string[], resultados: object[] }} multiplas
 */
function mostrarResultado(sjf, multiplas) {
    document.getElementById("estado-vazio").style.display = "none";

    const wrapper = document.getElementById("resultado-wrapper");
    wrapper.style.display        = "flex";
    wrapper.style.flexDirection  = "column";
    wrapper.style.flex           = "1";

    // resumo chips
    const chips = document.getElementById("resumo-chips");
    chips.innerHTML = "";
    chips.appendChild(criarChip("Ciclo CPU",  String(sjf.tempoCicloCpu)));
    chips.appendChild(criarChip("Fim SJF",    String(sjf.tempoFinal)));
    chips.appendChild(criarChip("Fim Total",  String(multiplas.tempoFinal)));

    // blocos
    const container = document.getElementById("resultado");
    container.innerHTML = "";
    container.appendChild(criarBlocoResultado(sjf));
    container.appendChild(criarBlocoResultado(multiplas));
}

/**
 * @param {string} label
 * @param {string} valor
 * @returns {HTMLElement}
 */
function criarChip(label, valor) {
    const chip = document.createElement("div");
    chip.className = "rchip";

    const lbl = document.createElement("span");
    lbl.className   = "rchip-lbl";
    lbl.textContent = label;

    const val = document.createElement("span");
    val.className   = "rchip-val";
    val.textContent = valor;

    chip.appendChild(lbl);
    chip.appendChild(val);
    return chip;
}

/**
 * @param {{ algoritmo: string, tempoFinal: number, linhaDoTempo: string[], resultados: object[] }} resultado
 * @returns {HTMLElement}
 */
function criarBlocoResultado(resultado) {
    const algoritmo    = resultado.algoritmo    || "";
    const tempoFinal   = resultado.tempoFinal   || 0;
    const linhaDoTempo = resultado.linhaDoTempo || [];
    const resultados   = resultado.resultados   || [];

    const isSJF = algoritmo.toLowerCase().includes("sjf");

    // wrapper
    const bloco = document.createElement("div");
    bloco.className = "bloco-resultado";

    // header
    const header = document.createElement("div");
    header.className = "bloco-header";

    const titulo = document.createElement("span");
    titulo.className   = "bloco-title";
    titulo.textContent = algoritmo;

    const badge = document.createElement("span");
    badge.className   = "bloco-badge";
    badge.textContent = isSJF ? "Não-preemptivo" : "Preemptivo";
    if (isSJF) {
        badge.style.cssText = "background:var(--green-bg);color:var(--green);border:1px solid rgba(78,203,142,0.2)";
    } else {
        badge.style.cssText = "background:var(--amber-bg);color:var(--amber);border:1px solid var(--amber-bdr)";
    }

    header.appendChild(titulo);
    header.appendChild(badge);
    bloco.appendChild(header);

    // body
    const body = document.createElement("div");
    body.className = "bloco-body";

    // fórmula
    const formula = document.createElement("div");
    formula.className   = "formula";
    formula.textContent = "Espera = Vida − CPU  |  Vida = Conclusão − Chegada";
    body.appendChild(formula);

    // gantt
    const ganttWrap = document.createElement("div");
    const ganttLbl  = document.createElement("div");
    ganttLbl.className   = "subsection-label";
    ganttLbl.textContent = "Diagrama de Gantt";
    ganttWrap.appendChild(ganttLbl);
    ganttWrap.appendChild(criarGantt(linhaDoTempo));
    body.appendChild(ganttWrap);

    // linha do tempo
    const ltWrap = document.createElement("div");
    const ltLbl  = document.createElement("div");
    ltLbl.className   = "subsection-label";
    ltLbl.textContent = "Linha do Tempo";
    ltWrap.appendChild(ltLbl);

    const lt = document.createElement("div");
    lt.className = "linha-tempo";
    linhaDoTempo.forEach(function(texto) {
        const span = document.createElement("span");
        span.className   = "item-tempo";
        span.textContent = texto;
        lt.appendChild(span);
    });
    ltWrap.appendChild(lt);
    body.appendChild(ltWrap);

    // tabela
    const tabelaWrap = document.createElement("div");
    const tabelaLbl  = document.createElement("div");
    tabelaLbl.className   = "subsection-label";
    tabelaLbl.textContent = "Tabela de Resultados";
    tabelaWrap.appendChild(tabelaLbl);

    const outerDiv = document.createElement("div");
    outerDiv.className = "tabela-wrap";
    outerDiv.appendChild(criarTabela(resultados));
    tabelaWrap.appendChild(outerDiv);
    body.appendChild(tabelaWrap);

    // tempo final
    const tf = document.createElement("p");
    tf.className = "tempo-final";
    tf.textContent = "Tempo final: ";
    const tfVal = document.createElement("strong");
    tfVal.textContent = String(tempoFinal);
    tf.appendChild(tfVal);
    body.appendChild(tf);

    bloco.appendChild(body);
    return bloco;
}

// ─── GANTT ────────────────────────────────────────────────────────────────────

/**
 * @param {string[]} linhaDoTempo
 * @returns {HTMLElement}
 */
function criarGantt(linhaDoTempo) {
    const blocos = linhaDoTempo.map(extrairDados).filter(function(b) { return b !== null; });

    const outer = document.createElement("div");
    outer.className = "gantt-outer";

    if (blocos.length === 0) {
        const msg = document.createElement("p");
        msg.style.cssText  = "color:var(--text-3);font-size:12px;";
        msg.textContent    = "Não foi possível gerar o diagrama.";
        outer.appendChild(msg);
        return outer;
    }

    const inicio = Math.min.apply(null, blocos.map(function(b) { return b.inicio; }));
    const fim    = Math.max.apply(null, blocos.map(function(b) { return b.fim;    }));
    const total  = fim - inicio;

    // eixo
    const eixo = document.createElement("div");
    eixo.className = "gantt-eixo";
    const eixoEsq = document.createElement("span");
    eixoEsq.textContent = "t = " + inicio;
    const eixoDir = document.createElement("span");
    eixoDir.textContent = "t = " + fim;
    eixo.appendChild(eixoEsq);
    eixo.appendChild(eixoDir);
    outer.appendChild(eixo);

    // barra
    const barra = document.createElement("div");
    barra.className = "gantt-barra";

    blocos.forEach(function(b) {
        const pct  = ((b.fim - b.inicio) / total) * 100;
        const div  = document.createElement("div");
        div.className   = "gantt-bloco " + obterClasseGantt(b.fila);
        div.style.width = pct + "%";
        div.title       = b.nome + ": " + b.inicio + "\u2192" + b.fim;

        const nome = document.createElement("span");
        nome.textContent = b.nome;

        const tempos = document.createElement("small");
        tempos.textContent = b.inicio + "\u2013" + b.fim;

        div.appendChild(nome);
        div.appendChild(tempos);
        barra.appendChild(div);
    });
    outer.appendChild(barra);

    // legenda
    const legenda = document.createElement("div");
    legenda.className = "gantt-legenda";
    [
        { label: "SJF",     cls: "legenda-sjf"     },
        { label: "Urgente", cls: "legenda-urgente"  },
        { label: "Normal",  cls: "legenda-normal"   },
        { label: "Lote",    cls: "legenda-lote"     }
    ].forEach(function(item) {
        const span = document.createElement("span");
        const icon = document.createElement("i");
        icon.className = item.cls;
        span.appendChild(icon);
        span.appendChild(document.createTextNode(item.label));
        legenda.appendChild(span);
    });
    outer.appendChild(legenda);

    return outer;
}

// ─── TABELA ───────────────────────────────────────────────────────────────────

/**
 * @param {Array<{ nome: string, fila: string, tempoChegada: number, tempoCpu: number, tempoInicio: number, tempoConclusao: number, tempoEspera: number, tempoVida: number }>} resultados
 * @returns {HTMLTableElement}
 */
function criarTabela(resultados) {
    const table  = document.createElement("table");
    const thead  = document.createElement("thead");
    const trHead = document.createElement("tr");

    ["Documento", "Fila", "Chegada", "CPU", "Início", "Conclusão", "Espera", "Vida"].forEach(function(col) {
        const th = document.createElement("th");
        th.textContent = col;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    resultados.forEach(function(p) {
        const nome         = p.nome          || "";
        const fila         = p.fila          || "";
        const tempoChegada = p.tempoChegada  != null ? p.tempoChegada  : 0;
        const tempoCpu     = p.tempoCpu      != null ? p.tempoCpu      : 0;
        const tempoInicio  = p.tempoInicio   != null ? p.tempoInicio   : 0;
        const tempoConcl   = p.tempoConclusao != null ? p.tempoConclusao : 0;
        const tempoEspera  = p.tempoEspera   != null ? p.tempoEspera   : 0;
        const tempoVida    = p.tempoVida     != null ? p.tempoVida     : 0;

        const tr = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = nome;
        tr.appendChild(tdNome);

        const tdFila = document.createElement("td");
        const pill   = document.createElement("span");
        pill.className   = "fila-pill " + fila.toLowerCase();
        pill.textContent = fila;
        tdFila.appendChild(pill);
        tr.appendChild(tdFila);

        [tempoChegada, tempoCpu, tempoInicio, tempoConcl, tempoEspera, tempoVida].forEach(function(val) {
            const td = document.createElement("td");
            td.textContent = String(val);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * @param {string} texto
 * @returns {{ nome: string, fila: string, inicio: number, fim: number } | null}
 */
function extrairDados(texto) {
    const regex = /^(.*?)\s*(?:\((.*?)\))?\s*executou de\s*(\d+)\s*até\s*(\d+)/;
    const m = texto.match(regex);
    if (!m) { return null; }
    return {
        nome:   m[1].trim(),
        fila:   m[2] ? m[2].trim().toLowerCase() : "sjf",
        inicio: Number(m[3]),
        fim:    Number(m[4])
    };
}

/**
 * @param {string} fila
 * @returns {string}
 */
function obterClasseGantt(fila) {
    switch ((fila || "").toLowerCase()) {
        case "urgente": return "gantt-urgente";
        case "normal":  return "gantt-normal";
        case "lote":    return "gantt-lote";
        default:        return "gantt-sjf";
    }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

criarInputsSJF("filaSJF", processosSJF);
criarInputsMultiplas("filaMultiplas", processosMultiplas);