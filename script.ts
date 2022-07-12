interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}



( function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil/60000);
        const sec = Math.floor(mil % 60000 / 1000);

        return `${min}m e ${sec}s`;
    }

    function patio(){
        function ler(): Veiculo[]{  // AQUI DEFINIMOS QUE O RETORNO DESSA FUNÇÃO É UM ARRAY DE VEÍCULO
            // se tiver algo salvo no localStorage ele retorna, senão retorna array vazio
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }

        function adicionar(veiculo: Veiculo, salva?: boolean){   // SALVA É PARA DEFINIRMOS QUANDO DEVEREMOS SALVAR AS INFORMAÇÕES
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;

            // NÃO USAMOS O ARROW FUNCTION PORQUE NÃO DÁ PRA USAR O THIS. POR ISSO USAMOS O FUNCTION MESMO
            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);
            })

            $("#patio")?.appendChild(row);

            if (salva) salvar([...ler(), veiculo]); // SE SALVA TRUE ELE EXECUTA
        }

        function remover(placa: string){
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);

            const tempo = calcTempo( new Date().getTime() - new Date(entrada).getTime() );   // new Date().getTime() PEGA O TEMPO EM MILISSEGUNDOS. SOMENTE O Date() NÃO PODE FAZER CÁLCULOS

            if(
                !confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)
            )
            return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            renderizar();
        }

        function renderizar(){
            //  ESTÁ USANDO ! NO INNER PRA FORÇAR A VALIDAÇÃO. CUIDADO AO USAR ESSE COMANDO SE NÃO TIVER CERTEZA
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return { ler, adicionar, remover, salvar, renderizar};
    }

    patio().renderizar();

    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        console.log( { nome, placa } );

        if ( !nome || !placa ){
            alert("Os campos nome e placa são obrigatórios");
            return;
        }


        // new Date().toISOString() retorna o horário no padrão ISO
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() } , true);
        // new Date() pega a hora atual
    }
    );
} )  ();