import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()

    this.onadd()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@gitFav:')) || []
  }

  save() {
    localStorage.setItem('@gitFav:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExist = this.entries.find(entry => entry.login === username)

      if (userExist) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login)

    this.entries = filteredEntries

    this.update()
    this.save()
  }

}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = document.querySelector('table tbody')

    this.update()
  }

  update() {
    this.removeAll()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositorie').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.btn-remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  onadd() {
    const addButton = this.root.querySelector('.btn-search')
    addButton.onclick = () => {
      const value = this.root.querySelector('#input-search').value

      this.add(value)
    }
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/d-dionisio.png" alt="Imagem de Douglas Dionísio">
      <a href="https:github.com/d-dionisio" target="_blank">
        <p>Douglas Dionísio</p>
        <span>d-dionisio</span>
      </a>
    </td>
    <td class="repositorie">123</td>
    <td class="followers">1234</td>
    <td><button class="btn-remove">Remover</button></td>
    `
    return tr
  }

  removeAll() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}