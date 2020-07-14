class ListItem extends Stimulus.Controller {
  static get targets() {}
  initialize() {}

  destroyItem(evt) {
    evt.preventDefault()

    return axios
      .delete('/${this.path}/${this.itemId}')
      .then(resp => {
        location.reload()
      })
  }

  get itemId() {
    return this.data.get('id')
  }

  get path() {
    return this.data.get('path')
  }
}
