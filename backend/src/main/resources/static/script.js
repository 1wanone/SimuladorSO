const processosSJF = [
    { nome: "Doc1", tempoChegada: 0, tempoCpu: 8 },
    { nome: "Doc2", tempoChegada: 1, tempoCpu: 4 },
    { nome: "Doc3", tempoChegada: 2, tempoCpu: 9 },
    { nome: "Doc4", tempoChegada: 3, tempoCpu: 5 },
    { nome: "Doc5", tempoChegada: 4, tempoCpu: 2 }
];

const processosMultiplas = [
    { nome: "Doc6",  tempoChegada: 0, tempoCpu: 7, fila: "normal"  },
    { nome: "Doc7",  tempoChegada: 1, tempoCpu: 4, fila: "lote"    },
    { nome: "Doc8",  tempoChegada: 2, tempoCpu: 3, fila: "urgente" },
    { nome: "Doc9",  tempoChegada: 3, tempoCpu: 6, fila: "normal"  },
    { nome: "Doc10", tempoChegada: 4, tempoCpu: 2, fila: "urgente" }
];

function criarInputsSJF(containerId, processos) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    processos.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "processo tres-col";
        div.innerHTML = `
            <input value="${p.nome}" id="${containerId}-nome-${i}" type="text">
            <input type="number" value="${p.tempoChegada}" id="${containerId}-chegada-${i}" min="0">
            <input type="number" value="${p.tempoCpu}" id="${containerId}-cpu-${i}" min="1">
        `;
        container.appendChild(div);
    });
}

function criarInputsMultiplas(containerId, processos) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    processos.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "processo quatro-col";
        div.innerHTML = `
            <input value="${p.nome}" id="${containerId}-nome-${i}" type="text">
            <input type="number" value="${p.tempoChegada}" id="${containerId}-chegada-${i}" min="0">
            <input type="number" value="${p.tempoCpu}" id="${containerId}-cpu-${i}" min="1">
            <select id="${containerId}-fila-${i}">
                <option value="urgente" ${p.fila === "urgente" ? "selected" : ""}>Urgente</option>
                <option value="normal"  ${p.fila === "normal"  ? "selected" : ""}>Normal</option>
                <option value="lote"    ${p.fila === "lote"    ? "selected" : ""}>Lote</option>
            </select>
        `;
        container.appendChild(div);
    });
}

function lerProcessosSJF(containerId, qtd) {
    return Array.from({ length: qtd }, (_, i) => ({
        nome:         document.getElementById(`${containerId}-nome-${i}`).value,
        tempoChegada: Number(document.getElementById(`${containerId}-chegada-${i}`).value),
        tempoCpu:     Number(document.getElementById(`${containerId}-cpu-${i}`).value),
        fila: "SJF"
    }));
}

function lerProcessosMultiplas(containerId, qtd) {
    return Array.from({ length: qtd }, (_, i) => ({
        nome:         document.getElementById(`${containerId}-nome-${i}`).value,
        tempoChegada: Number(document.getElementById(`${containerId}-chegada-${i}`).value),
        tempoCpu:     Number(document.getElementById(`${containerId}-cpu-${i}`).value),
        fila:         document.getElementById(`${containerId}-fila-${i}`).value
    }));
}

async function executarSimulacao() {
    const btn = document.querySelector(".btn-executar");
    btn.disabled = true;
    btn.textContent = "Calculando...";

    try {
        const filaSJF       = lerProcessosSJF("filaSJF", 5);
        const filaMultiplas = lerProcessosMultiplas("filaMultiplas", 5);
        const tempoCicloCpu = Number(document.getElementById("tempoCicloCpu").value);

        if (tempoCicloCpu <= 0) {
            alert("O tempo de ciclo de CPU deve ser maior que zero.");
            return;
        }

        const rSJF = await fetch("/api/impressora/sjf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ processos: filaSJF, tempoCicloCpu })
        });
        if (!rSJF.ok) throw new Error("Erro no endpoint SJF.");
        const resultadoSJF = await rSJF.json();

        const rMult = await fetch("/api/impressora/multiplas-filas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processos: filaMultiplas,
                tempoInicial: resultadoSJF.tempoFinal,
                tempoCicloCpu
            })
        });
        if (!rMult.ok) throw new Error("Erro no endpoint Múltiplas Filas.");
        const resultadoMultiplas = await rMult.json();

        mostrarResultado(resultadoSJF, resultadoMultiplas);

    } catch (err) {
        console.error(err);
        alert("Erro ao executar a simulação. Verifique se o back-end está rodando.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Executar Simulação`;
    }
}

function mostrarResultado(sjf, multiplas) {
    document.getElementById("placeholder").style.display = "none";

    const section = document.getElementById("resultado-section");
    section.style.display = "block";

    document.getElementById("resumo-chips").innerHTML = `
        <div class="resumo-chip">
            <span class="chip-label">Ciclo CPU</span>
            <span class="chip-val">${sjf.tempoCicloCpu}</span>
        </div>
        <div class="resumo-chip">
            <span class="chip-label">Fim SJF</span>
            <span class="chip-val">${sjf.tempoFinal}</span>
        </div>
        <div class="resumo-chip">
            <span class="chip-label">Fim Total</span>
            <span class="chip-val">${multiplas.tempoFinal}</span>
        </div>
    `;

    document.getElementById("resultado").innerHTML =
        criarBlocoResultado(sjf) + criarBlocoResultado(multiplas);
}

function criarBlocoResultado(resultado) {
    const isSJF = resultado.algoritmo && resultado.algoritmo.toLowerCase().includes("sjf");
    const corBadge = isSJF
        ? `style="background:var(--sjf-dim);color:var(--sjf);border:1px solid rgba(78,203,142,0.25)"`
        : `style="background:var(--amber-dim);color:var(--amber);border:1px solid var(--amber-glow)"`;
    const labelBadge = isSJF ? "Não-preemptivo" : "Preemptivo";

    return `
        <div class="bloco-resultado">
            <h3>
                ${resultado.algoritmo}
                <span class="algo-badge" ${corBadge}>${labelBadge}</span>
            </h3>

            <div class="formula">
                Tempo de espera = Tempo de vida − Tempo de CPU &nbsp;|&nbsp;
                Tempo de vida = Tempo de conclusão − Tempo de chegada
            </div>

            <div class="gantt-wrap">
                <div class="gantt-section-title">Diagrama de Gantt</div>
                ${criarDiagramaGantt(resultado)}
            </div>

            <div class="timeline-section">
                <div class="gantt-section-title">Linha do tempo</div>
                <div class="linha-tempo">
                    ${resultado.linhaDoTempo.map(item => `<span class="item-tempo">${item}</span>`).join("")}
                </div>
            </div>

            <div class="gantt-section-title" style="margin-bottom:10px;">Tabela de resultados</div>
            <div class="tabela-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Fila</th>
                            <th>Chegada</th>
                            <th>CPU</th>
                            <th>Início</th>
                            <th>Conclusão</th>
                            <th>Espera</th>
                            <th>Vida</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${resultado.resultados.map(p => `
                            <tr>
                                <td>${p.nome}</td>
                                <td><span class="fila-pill ${p.fila.toLowerCase()}">${p.fila}</span></td>
                                <td>${p.tempoChegada}</td>
                                <td>${p.tempoCpu}</td>
                                <td>${p.tempoInicio}</td>
                                <td>${p.tempoConclusao}</td>
                                <td>${p.tempoEspera}</td>
                                <td>${p.tempoVida}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>

            <p class="tempo-final">
                Tempo final: <strong>${resultado.tempoFinal}</strong>
            </p>
        </div>
    `;
}

function criarDiagramaGantt(resultado) {
    const blocos = resultado.linhaDoTempo
        .map(extrairDadosLinhaTempo)
        .filter(Boolean);

    if (!blocos.length) {
        return `<p style="color:var(--text-muted);font-size:13px;">Não foi possível gerar o Diagrama de Gantt.</p>`;
    }

    const inicio   = Math.min(...blocos.map(b => b.inicio));
    const fim      = Math.max(...blocos.map(b => b.fim));
    const total    = fim - inicio;

    return `
        <div class="gantt-container">
            <div class="gantt-eixo">
                <span>t = ${inicio}</span>
                <span>t = ${fim}</span>
            </div>
            <div class="gantt-barra">
                ${blocos.map(b => {
        const pct = ((b.fim - b.inicio) / total) * 100;
        const cls = obterClasseFila(b.fila);
        return `
                        <div class="gantt-bloco ${cls}" style="width:${pct}%;" title="${b.nome}: ${b.inicio} → ${b.fim}">
                            <span>${b.nome}</span>
                            <small>${b.inicio} – ${b.fim}</small>
                        </div>
                    `;
    }).join("")}
            </div>
            <div class="gantt-legenda">
                <span><i class="legenda-sjf"></i>SJF</span>
                <span><i class="legenda-urgente"></i>Urgente</span>
                <span><i class="legenda-normal"></i>Normal</span>
                <span><i class="legenda-lote"></i>Lote</span>
            </div>
        </div>
    `;
}

function extrairDadosLinhaTempo(texto) {
    const regex = /^(.*?)\s*(?:\((.*?)\))?\s*executou de\s*(\d+)\s*até\s*(\d+)/;
    const m = texto.match(regex);
    if (!m) return null;
    return {
        nome:  m[1].trim(),
        fila:  m[2] ? m[2].trim().toLowerCase() : "sjf",
        inicio: Number(m[3]),
        fim:    Number(m[4])
    };
}

function obterClasseFila(fila) {
    switch ((fila || "").toLowerCase()) {
        case "urgente": return "gantt-urgente";
        case "normal":  return "gantt-normal";
        case "lote":    return "gantt-lote";
        default:        return "gantt-sjf";
    }
}

criarInputsSJF("filaSJF", processosSJF);
criarInputsMultiplas("filaMultiplas", processosMultiplas);