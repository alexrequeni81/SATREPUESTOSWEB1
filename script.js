document.getElementById('repuestos-form').addEventListener('submit', saveRepuesto);

function search() {
    const query = document.getElementById('search').value;
    fetch(`http://localhost:3000/api/repuestos/${query}`)
        .then(response => response.json())
        .then(data => renderTable(data.data));
}

function saveRepuesto(e) {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const referencia = document.getElementById('referencia').value;
    const descripcion = document.getElementById('descripcion').value;
    const maquina = document.getElementById('maquina').value;
    const grupo = document.getElementById('grupo').value;
    const comentario = document.getElementById('comentario').value;
    const cant = document.getElementById('cant').value;

    const repuesto = { referencia, descripcion, maquina, grupo, comentario, cant };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:3000/api/repuestos/${id}` : 'http://localhost:3000/api/repuestos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(repuesto)
    }).then(response => response.json())
      .then(() => {
          search();
          clearForm();
      });
}

function renderTable(data) {
    const tbody = document.querySelector('#repuestos-table tbody');
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${row.referencia}</td>
            <td>${row.descripcion}</td>
            <td>${row.maquina}</td>
            <td>${row.grupo}</td>
            <td>${row.comentario}</td>
            <td>${row.cant}</td>
            <td>
                <button onclick="editRepuesto(${row.id})">Editar</button>
                <button onclick="deleteRepuesto(${row.id})">Borrar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function editRepuesto(id) {
    fetch(`http://localhost:3000/api/repuestos`)
        .then(response => response.json())
        .then(data => {
            const repuesto = data.data.find(row => row.id === id);
            document.getElementById('id').value = repuesto.id;
            document.getElementById('referencia').value = repuesto.referencia;
            document.getElementById('descripcion').value = repuesto.descripcion;
            document.getElementById('maquina').value = repuesto.maquina;
            document.getElementById('grupo').value = repuesto.grupo;
            document.getElementById('comentario').value = repuesto.comentario;
            document.getElementById('cant').value = repuesto.cant;
        });
}

function deleteRepuesto(id) {
    fetch(`http://localhost:3000/api/repuestos/${id}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(() => search());
}

function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('referencia').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('maquina').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('comentario').value = '';
    document.getElementById('cant').value = '';
}
