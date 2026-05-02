const processosSJF = [
    { nome: "Doc1", tempoChegada: 0, tempoCpu: 8 },
    { nome: "Doc2", tempoChegada: 1, tempoCpu: 4 },
    { nome: "Doc3", tempoChegada: 2, tempoCpu: 9 },
    { nome: "Doc4", tempoChegada: 3, tempoCpu: 5 },
    { nome: "Doc5", tempoChegada: 4, tempoCpu: 2 }
];

const processosMultiplas = [
    { nome: "Doc6", tempoChegada: 0, tempoCpu: 7, fila: "normal" },
    { nome: "Doc7", tempoChegada: 1, tempoCpu: 4, fila: "lote" },
    { nome: "Doc8", tempoChegada: 2, tempoCpu: 3, fila: "urgente" },
    { nome: "Doc9", tempoChegada: 3, tempoCpu: 6, fila: "normal" },
    { nome: "Doc10", tempoChegada: 4, tempoCpu: 2, fila: "urgente" }
];

function criarInputsSJF(containerId, processos) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    processos.forEach((processo, index) => {
        const div = document.createElement("div");
        div.className = "processo tres-colunas";

        div.innerHTML = `
            <input value="${processo.nome}" id="${containerId}-nome-${index}">
            <input type="number" value="${processo.tempoChegada}" id="${containerId}-chegada-${index}">
            <input type="number" value="${processo.tempoCpu}" id="${containerId}-cpu-${index}">
        `;

        container.appendChild(div);
    });
}

function criarInputsMultiplas(containerId, processos) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    processos.forEach((processo, index) => {
        const div = document.createElement("div");
        div.className = "processo quatro-colunas";

        div.innerHTML = `
            <input value="${processo.nome}" id="${containerId}-nome-${index}">
            <input type="number" value="${processo.tempoChegada}" id="${containerId}-chegada-${index}">
            <input type="number" value="${processo.tempoCpu}" id="${containerId}-cpu-${index}">
            <select id="${containerId}-fila-${index}">
                <option value="urgente" ${processo.fila === "urgente" ? "selected" : ""}>Urgente</option>
                <option value="normal" ${processo.fila === "normal" ? "selected" : ""}>Normal</option>
                <option value="lote" ${processo.fila === "lote" ? "selected" : ""}>Lote</option>
            </select>
        `;

        container.appendChild(div);
    });
}

function lerProcessosSJF(containerId, quantidade) {
    const lista = [];

    for (let i = 0; i < quantidade; i++) {
        lista.push({
            nome: document.getElementById(`${containerId}-nome-${i}`).value,
            tempoChegada: Number(document.getElementById(`${containerId}-chegada-${i}`).value),
            tempoCpu: Number(document.getElementById(`${containerId}-cpu-${i}`).value),
            fila: "SJF"
        });
    }

    return lista;
}

function lerProcessosMultiplas(containerId, quantidade) {
    const lista = [];

    for (let i = 0; i < quantidade; i++) {
        lista.push({
            nome: document.getElementById(`${containerId}-nome-${i}`).value,
            tempoChegada: Number(document.getElementById(`${containerId}-chegada-${i}`).value),
            tempoCpu: Number(document.getElementById(`${containerId}-cpu-${i}`).value),
            fila: document.getElementById(`${containerId}-fila-${i}`).value
        });
    }

    return lista;
}

async function executarSimulacao() {
    try {
        const filaSJF = lerProcessosSJF("filaSJF", 5);
        const filaMultiplas = lerProcessosMultiplas("filaMultiplas", 5);
        const tempoCicloCpu = Number(document.getElementById("tempoCicloCpu").value);

        if (tempoCicloCpu <= 0) {
            alert("O tempo de ciclo de CPU deve ser maior que zero.");
            return;
        }

        const respostaSJF = await fetch("/api/impressora/sjf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                processos: filaSJF,
                tempoCicloCpu: tempoCicloCpu
            })
        });

        if (!respostaSJF.ok) {
            throw new Error("Erro ao executar o SJF no back-end.");
        }

        const resultadoSJF = await respostaSJF.json();

        const respostaMultiplas = await fetch("/api/impressora/multiplas-filas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                processos: filaMultiplas,
                tempoInicial: resultadoSJF.tempoFinal,
                tempoCicloCpu: tempoCicloCpu
            })
        });

        if (!respostaMultiplas.ok) {
            throw new Error("Erro ao executar Múltiplas Filas no back-end.");
        }

        const resultadoMultiplas = await respostaMultiplas.json();

        mostrarResultado(resultadoSJF, resultadoMultiplas);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao executar a simulação. Verifique se o back-end está rodando e se os endpoints estão corretos.");
    }
}

function mostrarResultado(sjf, multiplas) {
    const div = document.getElementById("resultado");

    div.innerHTML = `
        ${criarResumoGeral(sjf, multiplas)}
        ${criarBlocoResultado(sjf)}
        ${criarBlocoResultado(multiplas)}
    `;
}

function criarResumoGeral(sjf, multiplas) {
    return `
        <div class="resumo-geral">
            <div>
                <strong>Tempo de Ciclo de CPU</strong>
                <span>${sjf.tempoCicloCpu}</span>
            </div>

            <div>
                <strong>Fim do SJF</strong>
                <span>${sjf.tempoFinal}</span>
            </div>

            <div>
                <strong>Fim da Simulação</strong>
                <span>${multiplas.tempoFinal}</span>
            </div>
        </div>
    `;
}

function criarBlocoResultado(resultado) {
    return `
        <div class="bloco-resultado">
            <h3>${resultado.algoritmo}</h3>

            <p class="formula">
                Tempo de espera = Tempo de vida - Tempo de CPU |
                Tempo de vida = Tempo de conclusão - Tempo de chegada
            </p>

            <h4>Linha do tempo</h4>
            <div class="linha-tempo">
                ${resultado.linhaDoTempo.map(item => `<span class="item-tempo">${item}</span>`).join("")}
            </div>

            <h4 class="titulo-tabela">Tabela de resultados</h4>

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
                            <td>${p.fila}</td>
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

            <p class="tempo-final">
                Tempo final: <strong>${resultado.tempoFinal}</strong>
            </p>
        </div>
    `;
}

criarInputsSJF("filaSJF", processosSJF);
criarInputsMultiplas("filaMultiplas", processosMultiplas);