<template>
  <div>
    {{ nome }} - {{ senha }}
    <p>
      <label for="nome">Nome: </label>
      <input id="nome" type="text" v-model="nome" />
      <input id="nome2" type="text" :value="nome" />
    </p>
    <p>
      <label for="senha">Senha: </label>
      <input id="senha" type="text" v-model="senha" />
    </p>
    <button @click="inserirUsuario">Inserir</button>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <th>{{ usuario.id }}</th>
          <th>{{ usuario.nome }}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface usuario {
  id?: number
  nome: string
  senha: string
}

const nome = ref<string>('Teste')
const senha = ref<string>('senha')
const usuarios = ref<usuario[]>([
  { id: 1, nome: 'admin', senha: 'admin' },
  { id: 2, nome: 'teste', senha: 'teste' },
])

function inserirUsuario() {
  usuarios.value.push({ nome: nome.value, senha: senha.value })
  nome.value = ''
  senha.value = ''
}
</script>
