document.addEventListener('DOMContentLoaded', function() {
    app = firebase.app(); // Inicialize o Firebase e atribua-o à variável 'app'
    var db = app.firestore();

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

    const darkModeButton = document.querySelector('li a[href="#"]'); // Seleciona o botão de modo escuro na sua navegação
    darkModeButton.addEventListener('click', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do link
        toggleDarkMode();
    });

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    // Função para criar a lista de mesas com estilos diferentes
        function createTableList(data) {
        const column1 = document.getElementById('column1');
        const column2 = document.getElementById('column2');
        const column3 = document.getElementById('column3');
        const column4 = document.getElementById('column4');

        // Iterar pelos dados recuperados do banco de dados
        for (let mesa = 1; mesa <= 200; mesa++) {
            const tableData = data[mesa] || 'Não vendida';

            const listItem = document.createElement('li');
            listItem.classList.add('table-list-item');

            if (tableData === 'Não vendida') {
                listItem.classList.add('mesa-nao-vendida');
            } else if (tableData.includes(' Reservada')) {
                listItem.classList.add('mesa-reservada');
            } else if (tableData.includes(' Paga')) {
                listItem.classList.add('mesa-paga');
            }

            listItem.textContent = ` ${mesa}: ${tableData}`;

            // Distribuir mesas em 4 colunas
            if (mesa <= 50) {
                column1.appendChild(listItem);
            } else if (mesa <= 100) {
                column2.appendChild(listItem);
            } else if (mesa <= 150) {
                column3.appendChild(listItem);
            } else {
                column4.appendChild(listItem);
            }
        }
    }

    // Função para buscar os dados das mesas no Firebase
    function getMesasVendidas() {
        var mesasVendidas = {};

        // Consultar o banco de dados para obter as mesas vendidas
        db.collection('tables').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const tableNumber = parseInt(doc.id.replace('table_', ''));
                const tableData = doc.data();

                if (tableData.status === 'Paga') {
                    // Se a mesa está paga, incluir o nome da pessoa no objeto
                    mesasVendidas[tableNumber] = ` Paga - : ${tableData.name}`;
                } else if (tableData.status === 'Reservada') {
                    // Se a mesa está reservada, incluir o nome da pessoa no objeto
                    mesasVendidas[tableNumber] = ` Reservada - : ${tableData.name}`;
                } else {
                    mesasVendidas[tableNumber] = 'Não vendida';
                }
            });

            // Chamar a função para criar a lista de mesas após buscar os dados
            createTableList(mesasVendidas);
        });
    }

    // Chamar a função para buscar os dados e criar a lista quando a página carregar
    getMesasVendidas();

    // Adicionar um evento de clique ao botão para gerar o PDF
    
});