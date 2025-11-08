<template>
  <div class="container">
    <!-- Seção de Cadastro -->
    <div class="section cadastro">
      <h2>Cadastro de Anotação</h2>
      <form @submit.prevent="cadastrar" class="form">
        <p>
          <label id="textoLabel" for="texto">Texto: </label>
          <input type="text" id="texto" v-model="novaAnotacao.texto" required />
        </p>
        <p>
          <label id="dataHoraLabel" for="dataHora">Data/Hora: </label>
          <input type="datetime-local" id="dataHora" v-model="novaAnotacao.dataHora" required />
        </p>
        <p>
          <label id="usuarioLabel" for="usuario">Usuário: </label>
          <select id="usuario" v-model="novaAnotacao.usuario.id" required>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
              {{ usuario.nome }}
            </option>
          </select>
          <input type="number" id="usuarioInput" v-model="novaAnotacao.usuario.id" required />
        </p>
        <button type="submit">Cadastrar</button>
      </form>
    </div>

    <!-- Seção de Pesquisa -->
    <div class="section pesquisa">
      <h2>Pesquisar Anotações</h2>
      <form @submit.prevent="pesquisar" class="form">
        <p>
          <label id="textPesquisaLabel" for="textoPesquisa">Texto: </label>
          <input type="text" id="textoPesquisa" v-model="textoPesquisa" required />
        </p>
        <p>
          <label id="usuarioPesquisaLabel" for="nomeUsuarioPesquisa">Usuário: </label>
          <select id="nomeUsuarioPesquisa" v-model="nomeUsuarioPesquisa" required>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.nome">
              {{ usuario.nome }}
            </option>
          </select>
          <input type="text" id="nomeUsuarioPesquisaInput" v-model="nomeUsuarioPesquisa" required />
        </p>
        <button type="submit">Pesquisar</button>
      </form>
    </div>

    <!-- Seção de Resultados -->
    <div class="section resultados">
      <h2>Lista de Anotações</h2>
      <table v-if="anotacoes.length > 0" class="tabela">
        <thead>
          <tr>
            <th>Id</th>
            <th>Texto</th>
            <th>Antiguidade (dias)</th>
            <th>Nome do Usuário</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="anotacao in anotacoes" :key="anotacao.id">
            <td>{{ anotacao.id }}</td>
            <td>{{ anotacao.texto }}</td>
            <td>{{ antiguidade(anotacao.dataHora) }}</td>
            <td>{{ anotacao.usuario.nome }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="sem-registros">Nenhum registro foi encontrado para os critérios fornecidos.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface usuario {
  id: number
  nome?: string
  senha?: string
}

interface anotacao {
  id?: number
  texto: string
  dataHora: string
  usuario: usuario
}

const novaAnotacao = ref<anotacao>({ texto: '', dataHora: '', usuario: { id: 1 } })
const anotacoes = ref<anotacao[]>([{ id: 1, texto: 'bla', dataHora: '', usuario: { id: 1 } }])
const usuarios = ref<usuario[]>([{ id: 1, nome: 'admin' }])
const erro = ref<string>('')
const textoPesquisa = ref<string>('')
const nomeUsuarioPesquisa = ref<string>('')

async function cadastrar() {
  try {
    erro.value = ''
    await axios.post('anotacao', novaAnotacao.value)
    atualizar()
    novaAnotacao.value.texto = ''
    novaAnotacao.value.dataHora = ''
  } catch (e) {
    erro.value = (e as Error).message
  }
}

async function atualizar() {
  anotacoes.value = (await axios.get('anotacao')).data
}

async function pesquisar() {
  anotacoes.value = (
    await axios.get('anotacao/busca', {
      params: {
        texto: textoPesquisa.value,
        usuario: nomeUsuarioPesquisa.value,
      },
    })
  ).data
}

async function buscarUsuarios() {
  usuarios.value = (await axios.get('usuario')).data
}

function antiguidade(data: string) {
  const diferencaEmMilissegundos = Date.now() - Date.parse(data)
  const milissegundosPorDia = 1000 * 60 * 60 * 24
  return Math.round(Math.abs(diferencaEmMilissegundos) / milissegundosPorDia)
}

onMounted(() => {
  atualizar()
  buscarUsuarios()
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}

.section {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1rem;
  color: #333;
}

.form p {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  margin-right: 0.5rem;
}

input,
select {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #125a9c;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.tabela th,
.tabela td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.tabela th {
  background-color: #f0f0f0;
}

.sem-registros {
  color: #666;
  font-style: italic;
  margin-top: 1rem;
}
</style>
