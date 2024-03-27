document.addEventListener("DOMContentLoaded", function() {
    var firebaseConfig = {
            apiKey: "AIzaSyA91NQ3PIkgY_Ihj1dAgEzQLKTFnQmuZVI",
          authDomain: "reservquent.firebaseapp.com",
          databaseURL: "https://reservquent-default-rtdb.firebaseio.com",
          projectId: "reservquent",
          storageBucket: "reservquent.appspot.com",
          messagingSenderId: "135119553812",
          appId: "1:135119553812:web:7cab36e09b044587382e01"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    var producto = [];

    const logoutButton = document.getElementById('logout-button');

    // Adicionar um ouvinte de evento de clique ao botão "Sair"
    logoutButton.addEventListener('click', function() {
        // Desconectar o usuário do Firebase
        firebase.auth().signOut().then(function() {
            // Redirecionar o usuário para a página de login ou outra página desejada
            window.location.href = "index.html"; // Substitua "login.html" pelo URL da página de login
        }).catch(function(error) {
            console.error("Erro ao fazer logout:", error);
        });
    });
    const darkModeButton = document.querySelector('li a[href="#"]'); // Ajuste este seletor para o seu botão de modo escuro
    darkModeButton.addEventListener('click', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do link
        document.body.classList.toggle('dark-mode');
    });

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }
    // Pegar o modal
    var modal = document.getElementById("modalProdutoPraca");

    // Pegar o botão que abre o modal
    var btn = document.getElementById("btnAbrirModalPraca");

    // Pegar o elemento <span> que fecha o modal
    var span = document.getElementsByClassName("fechar")[0];

    // Quando o usuário clicar no botão, abrir o modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // Quando o usuário clicar em <span> (x), fechar o modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Quando o usuário clicar fora do modal, fechar ele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Função para adicionar produto
    function adicionarProducto(event) {
        event.preventDefault(); // Impede o recarregamento da página
    
        // Capturando os valores do formulário
        var idProdutoPracaInput = document.getElementById('idProdutoPraca');
        var nomeProdutoPracaInput = document.getElementById('nomeProdutoPraca');
        var quantidadeProdutoPracaInput = document.getElementById('quantidadeProdutoPraca');
        var tipoQuantidadePracaInput = document.getElementById('tipoQuantidadePraca');
        var valorPagoPracaInput = document.getElementById('valorPagoPraca');
        var valorVendaPracaInput = document.getElementById('valorVendaPraca');
    
        // Verificar se todos os campos têm valores válidos
        if (idProdutoPracaInput && nomeProdutoPracaInput && quantidadeProdutoPracaInput && tipoQuantidadePracaInput && valorPagoPracaInput && valorVendaPracaInput) {
            var idProdutoPraca = idProdutoPracaInput.value;
            var nomeProdutoPraca = nomeProdutoPracaInput.value;
            var quantidadeProdutoPraca = quantidadeProdutoPracaInput.value;
            var tipoQuantidadePraca = tipoQuantidadePracaInput.value;
            var valorPagoPraca = valorPagoPracaInput.value;
            var valorVendaPraca = valorVendaPracaInput.value;
    
            // Verificar se algum campo está vazio
            if (idProdutoPraca === "" || nomeProdutoPraca === "" || quantidadeProdutoPraca === "" || tipoQuantidadePraca === "" || valorPagoPraca === "" || valorVendaPraca === "") {
                alert("Preencha todos os campos do formulário antes de adicionar o produto.");
                return;
            }
    
            // Armazenando o produto no Firestore
            db.collection("producto").add({
                id: idProdutoPraca,
                nome: nomeProdutoPraca,
                quantidade: quantidadeProdutoPraca,
                tipoQuantidade: tipoQuantidadePraca,
                valorPago: valorPagoPraca,
                valorVenda: valorVendaPraca
            })
            .then(function(docRef) {
                console.log("Documento escrito com ID: ", docRef.id);
                alert("Produto adicionado com sucesso!"); // Mensagem de confirmação
                adicionarProductoNaTabela(idProdutoPraca, nomeProdutoPraca, quantidadeProdutoPraca, tipoQuantidadePraca, valorPagoPraca, valorVendaPraca, docRef.id); // Adicionar à tabela após a confirmação
                limparCamposFormulario(); // Limpar os campos do formulário
            })
            .catch(function(error) {
                console.error("Erro ao adicionar documento: ", error);
                alert("Erro ao adicionar o produto. Por favor, tente novamente."); // Mensagem de erro
            });
        } else {
            alert("Certifique-se de que todos os campos do formulário existem antes de adicionar o produto.");
        }
    }

    // Função para adicionar produto à tabela
    function adicionarProductoNaTabela(idProdutoPraca, nomeProdutoPraca, quantidadeProdutoPraca, tipoQuantidadePraca, valorPagoPraca, valorVendaPraca, docId) {
        var tabela = document.getElementById('tabelaProdutosPracaAlimentacao').getElementsByTagName('tbody')[0];
        
        var novaLinha = tabela.insertRow();
        var celulaId = novaLinha.insertCell(0);
        var celulaNome = novaLinha.insertCell(1);
        var celulaQuantidade = novaLinha.insertCell(2);
        var celulaValorPago = novaLinha.insertCell(3);
        var celulaValorVenda = novaLinha.insertCell(4);

        celulaId.textContent = idProdutoPraca;
        celulaNome.textContent = nomeProdutoPraca;
        celulaQuantidade.textContent = quantidadeProdutoPraca + ' ' + tipoQuantidadePraca;
        celulaValorPago.textContent = valorPagoPraca;
        celulaValorVenda.textContent = valorVendaPraca;

        // Adicione um botão de exclusão para cada produto
        var celulaAcoes = novaLinha.insertCell(5);
        var botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.className = 'excluir-button';
        botaoExcluir.setAttribute('data-doc-id', docId); // Adiciona o ID do documento do Firestore
        celulaAcoes.appendChild(botaoExcluir);
    }

    // Função para limpar os campos do formulário
    function limparCamposFormulario() {
        var idProdutoPracaInput = document.getElementById('idProdutoPraca');
        if (idProdutoPracaInput) {
            idProdutoPracaInput.value = '';
        }

        var nomeProdutoPracaInput = document.getElementById('nomeProdutoPraca');
        if (nomeProdutoPracaInput) {
            nomeProdutoPracaInput.value = '';
        }

        var quantidadeProdutoPracaInput = document.getElementById('quantidadeProdutoPraca');
        if (quantidadeProdutoPracaInput) {
            quantidadeProdutoPracaInput.value = '';
        }

        var tipoQuantidadePracaInput = document.getElementById('tipoQuantidadePraca');
        if (tipoQuantidadePracaInput) {
            tipoQuantidadePracaInput.value = 'duzia'; // Resetar para o valor padrão
        }

        var valorPagoPracaInput = document.getElementById('valorPagoPraca');
        if (valorPagoPracaInput) {
            valorPagoPracaInput.value = '';
        }

        var valorVendaPracaInput = document.getElementById('valorVendaPraca');
        if (valorVendaPracaInput) {
            valorVendaPracaInput.value = '';
        }
    }

    // Função para buscar produtos do Firestore e atualizar a tabela
    function fetchproducto() {
        db.collection("producto").get().then((querySnapshot) => {
            producto = []; // Limpar o array antes de atualizá-lo
            querySnapshot.forEach((doc) => {
                var productoData = doc.data();
                producto.push({...productoData, docId: doc.id}); // Adicionar ao array
            });
            updateTable(); // Atualizar a tabela após buscar os produtos
        }).catch(function(error) {
            console.error("Erro ao buscar produtos do Firestore: ", error);
        });
    }



    
// Função para atualizar a tabela com os produtos
function updateTable() {
    var tabela = document.getElementById('tabelaProdutosPracaAlimentacao').getElementsByTagName('tbody')[0];
    
    // Remover todas as linhas existentes na tabela
    while (tabela.rows.length > 0) {
        tabela.deleteRow(0);
    }

    // Adicionar cada produto do array 'producto' à tabela
    producto.forEach(function(productoData) {
        var novaLinha = tabela.insertRow();
        var celulaId = novaLinha.insertCell(0);
        var celulaNome = novaLinha.insertCell(1);
        var celulaQuantidade = novaLinha.insertCell(2);
        var celulaValorPago = novaLinha.insertCell(3);
        var celulaValorVenda = novaLinha.insertCell(4);

        celulaId.textContent = productoData.id;
        celulaNome.textContent = productoData.nome;
        celulaQuantidade.textContent = productoData.quantidade + ' ' + productoData.tipoQuantidade;
        celulaValorPago.textContent = productoData.valorPago;
        celulaValorVenda.textContent = productoData.valorVenda;

        // Verifica se o produto tem um 'docId' associado
        if (productoData.docId) {
            // Adicionar um botão de exclusão para cada produto
            var celulaAcoes = novaLinha.insertCell(5);
            var botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.className = 'excluir-button';
            botaoExcluir.setAttribute('data-doc-id', productoData.docId); // Adiciona o ID do documento do Firestore
            celulaAcoes.appendChild(botaoExcluir);
        }
    });
}




    // Event listener para exclusão de produtos
  // Event listener para exclusão de produtos
  document.getElementById('tabelaProdutosPracaAlimentacao').addEventListener('click', function (e) {
    e.preventDefault(); // Impede que o evento padrão do botão seja executado
    if (e.target && e.target.className == 'excluir-button') {
        var docId = e.target.getAttribute('data-doc-id');
        excluirProduto(docId);
    }
});

function excluirProduto(docId) {
    db.collection("producto").doc(docId).delete()
    .then(function() {
        console.log("Produto excluído com sucesso!");
        fetchproducto(); // Chama fetchproducto para atualizar a tabela
    })
    .catch(function(error) {
        console.error("Erro ao excluir produto: ", error);
    });
}



    // Chamar a função para buscar produtos ao carregar a página
    fetchproducto();

    // Adicionar evento de clique ao botão de adicionar produto
    document.getElementById('formProdutoPraca').addEventListener('submit', adicionarProducto);
});