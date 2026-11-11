// ===== MÁSCARA TELEFONE =====
const campoTelefone = document.getElementById('telefone');
campoTelefone.addEventListener('input', (e) => {
  let valor = e.target.value.replace(/\D/g, '').slice(0, 11);

  if (valor.length > 7) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  } else if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (valor.length > 0) {
    valor = valor.replace(/^(\d{0,2})/, '($1');
  }

  e.target.value = valor;
});

// ===== MÁSCARA CPF =====
const campoCPF = document.getElementById('CPF');
campoCPF.addEventListener('input', (e) => {
  let valor = e.target.value.replace(/\D/g, '').slice(0, 11);

  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  e.target.value = valor;
});

// ===== VALIDAÇÃO + SUBMIT =====
(() => {
  'use strict';

  const form = document.getElementById('formCadastro');
  const email = document.getElementById('email');
  const cpf = document.getElementById('CPF');
  const telefone = document.getElementById('telefone');
  const msgCpf = cpf.parentElement.querySelector('.invalid-feedback');

  // Verifica se o CPF já existe (compara só os números)
  function cpfJaCadastrado(valor) {
    const numeros = valor.replace(/\D/g, '');
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    return clientes.some((c) => c.cpf && c.cpf.replace(/\D/g, '') === numeros);
  }

  // Marca os campos como válidos/inválidos para o Bootstrap
  function validarCampos() {
    email.setCustomValidity(validarEmail(email.value) ? '' : 'E-mail inválido');

    // CPF: formato válido e não duplicado
    if (!validarCPF(cpf.value)) {
      cpf.setCustomValidity('CPF inválido');
      msgCpf.textContent = 'Informe um CPF válido.';
    } else if (cpfJaCadastrado(cpf.value)) {
      cpf.setCustomValidity('CPF já cadastrado');
      msgCpf.textContent = 'Este CPF já está cadastrado.';
    } else {
      cpf.setCustomValidity('');
    }

    // Telefone: só aceita completo, no formato (11) 99999-9999
    const telefoneCompleto = /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone.value);
    telefone.setCustomValidity(telefoneCompleto ? '' : 'Telefone inválido');
  }

  // Revalida enquanto o usuário digita
  [email, cpf, telefone].forEach((campo) => {
    campo.addEventListener('input', validarCampos);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    validarCampos();

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const cliente = {
      nome: document.getElementById('nome').value,
      email: email.value,
      cpf: cpf.value,
      telefone: telefone.value,
      setor: document.getElementById('setor').value,
      observacoes: document.getElementById('observacoes').value
    };

    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));

    const modal = new bootstrap.Modal(document.getElementById('modalSucesso'));
    modal.show();

    form.reset();
    validarCampos();
    form.classList.remove('was-validated');
  });

  validarCampos();
})();