export default class UsersLocalStore {
  static dataName = '@favorite-users'

  static setUser(user) {
    user = JSON.stringify(user)
    localStorage.setItem(this.dataName, user)
  }
  
  static getUser() {
    const users = JSON.parse(localStorage.getItem(this.dataName))

    return users
  }
}

