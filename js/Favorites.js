import { GitHubSearch } from './GitHubSearch.js'

import UsersLocalStore from './UsersLocalStore.js'

export class Favorites {
  users = []

  constructor(root){
    this.root = document.querySelector(root)

    this.getUsers()
  }
  
  getUsers() {
    this.users = UsersLocalStore.getUser() || []
  }

  setUsers() {
    UsersLocalStore.setUser(this.users)
  }

  async addUser(userName){
    try {
      if (userName === '') {
        throw new Error('Pesquisa vazia, digita um login github para favoritar!')
      }

      const userExist = this.users.find( user => user.login === userName)

      if (userExist) {
        throw new Error('Usuário já favoritado!')
      }

      const user = await GitHubSearch.search(userName)

      if (user.name === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.users = [user, ...this.users]

      this.setUsers()
      this.handleView()
    } catch (error) {
      alert(error.message)

      console.log(error)
    }
  }

  removeUser(name){
    this.users = this.users.filter( user => user.name !== name)

    this.setUsers()
    this.handleView()
  }
}

export class HandleFavorites extends Favorites {
  constructor(root) {
    super(root)

    this.handleView()

    this.addEventSearchUser()
  }
  
  handleView() {
    this.deleteAllTr()

    const tbody = this.root.querySelector('tbody')

    if (this.users.length === 0) {
      tbody.append(this.createTrNull())
    } else {
      this.users.forEach( user => {
        const tr = this.createTrUsers()

        tr.querySelector('.user img').src = `https://github.com/${user.login}.png`
        tr.querySelector('.user img').alt = `Imagem de ${user.name}`
        tr.querySelector('.user span').textContent = user.name
        tr.querySelector('.user a').href = `https://github.com/${user.login}`
        tr.querySelector('.user a').textContent = `/${user.login}`
        tr.querySelector('.repo').textContent = user.public_repos
        tr.querySelector('.follow').textContent = user.followers
        tr.querySelector('.remove button')
          .onclick = () => this.removeUser(user.name)

        tbody.append(tr)
      })
      
    }
  }

  deleteAllTr() {
    const trs = this.root.querySelectorAll('tbody tr')

    trs.forEach(tr => {
      tr.remove()
    })
  }

  createTrUsers() {
    const tr = document.createElement('tr')

    tr.innerHTML = `<td class="user">
      <img src="" alt="">
      <div>
        <span>Diego Fernandes</span>
        <a href="#" target="_blanck">/Alex</a>
      </div>
    </td>
    <td class="repo">123</td>
    <td class="follow">1234</td>
    <td class="remove">
      <button>Remover</button>
    </td>`

    return tr
  }

  createTrNull() {
    const tr = document.createElement('tr')

    tr.innerHTML = `<td>
      <div class="nullFavorete">
        <img src="./img/Estrela.svg" alt="Estrala com olho e nariz">
        <p>Nenhum favorito ainda</p>
      </div>
    </td>`

    return tr
  }

  addEventSearchUser() {
    const inputSearch = document.querySelector('.add input')

    inputSearch.addEventListener('keypress', (e) => {
      e.key === 'Enter' && this.addUser(inputSearch.value).then(() => inputSearch.value = '')
    })

    this.root.querySelector('.add button').onclick = () => {
      this.addUser(inputSearch.value).then(() => inputSearch.value = '')
    }
  }
}