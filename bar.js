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

    var produtos = []; // Alteração da variável para 'produtos'

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
    // Função para adicionar produto à tabela e ao Firestore
    function adicionarProduto(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // Capturando os valores do formulário
        var idProduto = document.getElementById('idProduto').value;
        var nomeProduto = document.getElementById('nomeProduto').value;
        var quantidadeProduto = document.getElementById('quantidadeProduto').value;
        var tipoQuantidade = document.getElementById('tipoQuantidade').value;
        var valorPago = document.getElementById('valorPago').value;
        var valorVenda = document.getElementById('valorVenda').value;

        // Armazenando o produto no Firestore
        db.collection("produtos").add({ // Alteração do nome da coleção para 'produtos'
            id: idProduto,
            nome: nomeProduto,
            quantidade: quantidadeProduto,
            tipoQuantidade: tipoQuantidade,
            valorPago: valorPago,
            valorVenda: valorVenda
        })
        .then(function(docRef) {
            console.log("Documento escrito com ID: ", docRef.id);
            alert("Produto adicionado com sucesso!"); // Mensagem de confirmação
            adicionarProdutoNaTabela(idProduto, nomeProduto, quantidadeProduto, tipoQuantidade, valorPago, valorVenda); // Adicionar à tabela após a confirmação
            limparCamposFormulario(); // Limpar os campos do formulário
        })
        .catch(function(error) {
            console.error("Erro ao adicionar documento: ", error);
            alert("Erro ao adicionar o produto. Por favor, tente novamente."); // Mensagem de erro
        });
    }

    // Função para adicionar produto à tabela
    function adicionarProdutoNaTabela(idProduto, nomeProduto, quantidadeProduto, tipoQuantidade, valorPago, valorVenda) {
        // Adicionando o produto à tabela
        var tabela = document.getElementById('tabelaProdutos').getElementsByTagName('tbody')[0];
        var novaLinha = tabela.insertRow();
        var celulaId = novaLinha.insertCell(0);
        var celulaNome = novaLinha.insertCell(1);
        var celulaQuantidade = novaLinha.insertCell(2);
        var celulaValorPago = novaLinha.insertCell(3);
        var celulaValorVenda = novaLinha.insertCell(4);

        celulaId.textContent = idProduto;
        celulaNome.textContent = nomeProduto;
        celulaQuantidade.textContent = quantidadeProduto + ' ' + tipoQuantidade;
        celulaValorPago.textContent = valorPago;
        celulaValorVenda.textContent = valorVenda;
    }

    // Função para limpar os campos do formulário
    function limparCamposFormulario() {
        document.getElementById('idProduto').value = '';
        document.getElementById('nomeProduto').value = '';
        document.getElementById('quantidadeProduto').value = '';
        document.getElementById('tipoQuantidade').value = 'duzia'; // Resetar para o valor padrão
        document.getElementById('valorPago').value = '';
        document.getElementById('valorVenda').value = '';
    }

    // Função para buscar produtos do Firestore e atualizar a tabela
    function fetchProdutos() {
        db.collection("produtos").get().then((querySnapshot) => { // Alteração do nome da coleção para 'produtos'
            produtos = []; // Limpar o array antes de adicionar novos produtos
            querySnapshot.forEach((doc) => {
                var produto = doc.data();
                produto.docId = doc.id; // Adicione o ID do documento ao objeto produto
                produtos.push(produto);
            });
            updateTable();
        }).catch(function(error) {
            console.error("Erro ao buscar produtos do Firestore: ", error);
        });
    }

    

// Função para atualizar a tabela com os produtos
// Função para atualizar a tabela com os produtos
function updateTable() {
    var tabela = document.getElementById('tabelaProdutos').getElementsByTagName('tbody')[0];
    
    if (!tabela) {
        console.error("Elemento da tabela não encontrado com o ID: tabelaProdutos");
        return;
    }

    // Remover todas as linhas existentes na tabela
    while (tabela.rows.length > 0) {
        tabela.deleteRow(0);
    }

    // Adicionar cada produto do array 'produtos' à tabela
    produtos.forEach(function(produto) {
        var novaLinha = tabela.insertRow();
        var celulaId = novaLinha.insertCell(0);
        var celulaNome = novaLinha.insertCell(1);
        var celulaQuantidade = novaLinha.insertCell(2);
        var celulaValorPago = novaLinha.insertCell(3);
        var celulaValorVenda = novaLinha.insertCell(4);

        celulaId.textContent = produto.id;
        celulaNome.textContent = produto.nome;
        celulaQuantidade.textContent = produto.quantidade + ' ' + produto.tipoQuantidade;
        celulaValorPago.textContent = produto.valorPago;
        celulaValorVenda.textContent = produto.valorVenda;
        
        // Adicione um botão de exclusão para cada produto
        var celulaAcoes = novaLinha.insertCell(5);
        var botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.className = 'excluir-button';
        botaoExcluir.setAttribute('data-doc-id', produto.docId); // Adiciona o ID do documento do Firestore
        celulaAcoes.appendChild(botaoExcluir);
    });
}



    // Chamar a função para buscar produtos ao carregar a página
    fetchProdutos();

    updateTable('tabelaProdutos', produtos);

    // Adicionando evento de clique ao botão de adicionar produto
    document.getElementById('formProduto').addEventListener('submit', adicionarProduto);

    // Pegar o modal
    var modal = document.getElementById("modalProduto");

    // Pegar o botão que abre o modal
    var btn = document.getElementById("btnAbrirModal");

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

    // Event listener para exclusão de produtos
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('excluir-button')) {
            var docId = event.target.getAttribute('data-doc-id');
            excluirProduto(docId);
        }
    });

    // Função para excluir um produto
    function excluirProduto(docId) {
        console.log("docId:", docId);
        db.collection("produtos").doc(docId).delete().then(function() {
            console.log("Produto excluído com sucesso!");
            fetchProdutos(); // Atualizar a tabela após a exclusão
        }).catch(function(error) {
            console.error("Erro ao excluir produto: ", error);
        });
    }
});
