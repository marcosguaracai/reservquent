document.addEventListener('DOMContentLoaded', function() {
    const tablesContainer = document.querySelector('.tables-container');
    const infoContainer = document.querySelector('.info-container');
    const form = document.getElementById('table-form');
    
    

    // Inicialização do Firebase (ativação e criação da variável db)
    var firebaseConfig = {
        apiKey: "AIzaSyA91NQ3PIkgY_Ihj1dAgEzQLKTFnQmuZVI",
          authDomain: "reservquent.firebaseapp.com",
          databaseURL: "https://reservquent-default-rtdb.firebaseio.com",
          projectId: "reservquent",
          storageBucket: "reservquent.appspot.com",
          messagingSenderId: "135119553812",
          appId: "1:135119553812:web:7cab36e09b044587382e01"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();


    

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


    const infoModal = document.getElementById('infoModal');
    const closeModal = document.getElementById('closeModal');

    // Evento para fechar o modal
    closeModal.addEventListener('click', function() {
        infoModal.style.display = 'none';
    });

    document.querySelectorAll('.table').forEach(table => {
        table.addEventListener('click', function() {
            const tableNumber = this.dataset.number;
            displayTableInfo(tableNumber);
        });
    });
    // Funções para interagir com o Firestore
    function saveTableData(tableNumber, data) {
        return db.collection('tables').doc(`table_${tableNumber}`).set(data).then(() => {
            updateVisualTablesState(tablesContainer);
        });
    }

    function getTableData(tableNumber) {
        return db.collection('tables').doc(`table_${tableNumber}`).get().then(doc => {
            return doc.exists ? doc.data() : null;
        });
    }

    function toggleTableStatus(tableNumber) {
        const adminUIDs = ["JMXpxDz8gVNOB30KAHVpL4aKNIJ3"]; // Lista de UIDs de administradores
        const user = firebase.auth().currentUser;
    
        if (user && adminUIDs.includes(user.uid)) {
            // Verifica se o usuário é um administrador
            // Exibe um aviso de confirmação antes de alterar o status da mesa
            const confirmMessage = `Tem certeza que deseja alterar o status da mesa ${tableNumber}?`;
            if (confirm(confirmMessage)) {
                getTableData(tableNumber).then(tableData => {
                    if (tableData) {
                        tableData.status = tableData.status === 'Reservada' ? 'Paga' : 'Reservada';
                        saveTableData(tableNumber, tableData).then(() => {
                            updateVisualTablesState(tablesContainer);
                            displayTableInfo(tableNumber, infoContainer);
                            alert(`Status da mesa ${tableNumber} alterado para ${tableData.status}.`);
                        }).catch(error => {
                            console.error("Erro ao salvar os dados da mesa:", error);
                            alert("Ocorreu um erro ao salvar os dados da mesa.");
                        });
                    }
                });
            }
        } else if (user) {
            alert("Você não tem permissão para alterar o status da mesa.");
        } else {
            alert("Você não está autenticado. Por favor, faça login para alterar o status da mesa.");
        }
    }
    
    function deleteTableData(tableNumber) {
        const adminUIDs = ["JMXpxDz8gVNOB30KAHVpL4aKNIJ3"]; // Lista de UIDs de administradores
        const user = firebase.auth().currentUser;
    
        if (user && adminUIDs.includes(user.uid)) {
            // Verifica se o usuário é um administrador
            // Exibe um aviso de confirmação antes de excluir a mesa
            const confirmMessage = `Tem certeza que deseja excluir a mesa ${tableNumber}?`;
            if (confirm(confirmMessage)) {
                return db.collection('tables').doc(`table_${tableNumber}`).delete().then(() => {
                    updateVisualTablesState(tablesContainer);
                    alert(`Mesa ${tableNumber} excluída com sucesso.`);
                    infoModal.style.display = 'none';
                    updateVisualTablesState(tablesContainer); 
                }).catch((error) => {
                    console.error("Erro ao excluir mesa:", error);
                    alert("Ocorreu um erro ao excluir a mesa.");
                    return Promise.reject("Erro ao excluir a mesa.");
                });
            }
        } else if (user) {
            alert("Você não tem permissão para excluir mesas.");
            return Promise.reject("Permissão insuficiente.");
        } else {
            alert("Você não está autenticado. Por favor, faça login para excluir a mesa.");
            return Promise.reject("Usuário não autenticado.");
        }
    }
    
    
    
    
    

    function createVisualTables(tablesContainer) {
        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const quadrantContainer = document.createElement('div');
            quadrantContainer.classList.add('quadrant');
            tablesContainer.appendChild(quadrantContainer);

            for (let i = 1; i <= 50; i++) {
                const tableElement = document.createElement('div');
                tableElement.classList.add('table');
                tableElement.dataset.number = i + quadrant * 50;
                tableElement.textContent = ` ${i + quadrant * 50}`;
                tableElement.addEventListener('click', function() {
                    document.querySelectorAll('.table').forEach(el => el.classList.remove('selected'));
                    tableElement.classList.add('selected');
                    displayTableInfo(i + quadrant * 50, infoContainer);
                });
                const row = Math.ceil(i / 10);
                const column = (i - 1) % 10 + 1;
                tableElement.style.gridRow = `${row}`;
                tableElement.style.gridColumn = `${column}`;
                quadrantContainer.appendChild(tableElement);
            }
        }
    }

    function updateVisualTablesState(tablesContainer) {
        db.collection('tables').get().then(querySnapshot => {
            let tables = []; // Definindo a variável tables aqui

            tablesContainer.innerHTML = '';

        // Reconstruir as mesas
        createVisualTables(tablesContainer);
            
    
            querySnapshot.forEach(doc => {
                // Preenchendo a variável tables com os dados de cada mesa
                tables.push({ id: doc.id, ...doc.data() });
    
                // Processamento existente para cada mesa
                const tableNumber = parseInt(doc.id.replace('table_', ''));
                const tableData = doc.data();
                const tableElement = tablesContainer.querySelector(`.table[data-number="${tableNumber}"]`);
                if (tableElement) {
                    tableElement.classList.remove('reserved', 'paid');
                    tableElement.classList.add(tableData.status === 'Reservada' ? 'reserved' : 'paid');
                }
            });
    
            // Chamada atualizada para usar a função correta
            updatePaidProgressBars(tables); // Atualizar a barra de progresso para mesas pagas
        });
    }
    
    
   function displayTableInfo(tableNumber, infoContainer) {
    getTableData(tableNumber).then(data => {
        const tableInfo = document.getElementById('table-info');
        const changeStatusButton = document.getElementById('change-status-button');
        const deleteButton = document.getElementById('delete-button');

        if (data) {
            // Inclua as informações de localização aqui
            tableInfo.innerHTML = `Mesa: ${tableNumber}<br>Nome: ${data.name}<br>Telefone: ${data.phone}<br>Status: ${data.status}<br>`;
            infoContainer.style.display = 'block';
            changeStatusButton.style.display = 'block';
            deleteButton.style.display = 'block';

            changeStatusButton.onclick = () => toggleTableStatus(tableNumber);
            deleteButton.onclick = () => deleteTableData(tableNumber).then(() => {
                infoContainer.style.display = 'none';
                updateVisualTablesState(tablesContainer);
            }).catch(error => {
                console.error("Falha ao excluir a mesa:", error);
            });
        } else {
            tableInfo.innerHTML = 'Mesa não reservada.';
            changeStatusButton.style.display = 'none';
            deleteButton.style.display = 'none';
            
        }
        infoModal.style.display = 'block';
    });
}

    
    
    
    
    

    function handleFormSubmission(form, infoContainer) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
    
            const tableNumber = parseInt(document.getElementById('table-number').value);
    
            // Verificar se o número da mesa está no intervalo permitido
            if (tableNumber < 1 || tableNumber > 200) {
                alert('Essa mesa não existe.');
                return;
            }
    
            getTableData(tableNumber).then(currentData => {
                if (currentData && (currentData.status === 'Reservada' || currentData.status === 'Paga')) {
                    alert('Esta mesa já está reservada ou paga.');
                    return;
                }
    
                const name = document.getElementById('customer-name').value;
                const phone = document.getElementById('customer-phone').value;
                const action = document.querySelector('input[name="table-action"]:checked').value;
    
                const status = action === 'reserve' ? 'Reservada' : 'Paga';
    
                saveTableData(tableNumber, { name, phone, status }).then(() => {
                    updateVisualTablesState(tablesContainer);
                    displayTableInfo(tableNumber, infoContainer);
                    alert("Ação realizada com sucesso!");
                });
            });
        });
    }
    
    function updateProgressBar(progressBarId, progress) {
        var progressBar = document.getElementById(progressBarId);
        progressBar.style.width = progress + '%';
    
        // Atualizar o texto do progresso se o elemento existir
        var progressText = document.getElementById("progressText");
        if (progressText) {
            progressText.textContent = progress.toFixed(0) + "% ";
        }
    }
    
    function updatePaidProgressBars(tables) {
        let totalTables = 200; // Total de mesas disponíveis
        let paidCount = tables.filter(table => table.status === 'Paga').length; // Contar apenas as mesas pagas
    
        let paidProgress = (paidCount / totalTables) * 100; // Calcular o progresso das mesas pagas
    
        updateProgressBar('paidProgressBar', paidProgress); // Atualizar a barra de progresso
    }
    
    
    
    
    createVisualTables(tablesContainer);
    updateVisualTablesState(tablesContainer);
    handleFormSubmission(form, infoContainer);
});