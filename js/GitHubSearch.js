export class GitHubSearch {
  static search(user) {
    const endPoint = `https://api.github.com/users/${user}`
    return fetch(endPoint)
      .then( resp => resp.json())
      .then(({ login, name, public_repos, followers } )=> ({ login, name, public_repos, followers }))
  }
}