const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const userList = JSON.parse(localStorage.getItem('favoriteUsers')) || []
const dataPanel = document.querySelector('#data-panel')



function renderUserList(data) {
  let rawHTML = ''
  data.forEach((user) => {
    // name, avatar
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${user.avatar}" class="card-img-top" alt="User Avater">
        <div class="card-body">
          <h5 class="card-title">${user.name} ${user.surname}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${user.id}">Info</button>
          <button class="btn btn-danger btn-remove-user" data-id="${user.id}">X</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

renderUserList(userList)

function showUserModal(id) {
  const modalTitle = document.querySelector('#user-modal-title')
  const modalDate = document.querySelector('#user-birthday')
  const modalAge = document.querySelector('#user-age')
  const modalGender = document.querySelector('#user-gender')
  const modalEmail = document.querySelector('#user-email')
  modalTitle.textContent = ''
  modalDate.textContent = ''
  modalGender.textContent = ''
  modalEmail.textContent = ''
  modalAge.textContent = ''
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalTitle.innerText = data.name + ' ' + data.surname
    modalDate.innerText = 'Birthday: ' + data.birthday
    modalAge.innerText = '' + data.age
    modalGender.innerText = data.gender
    modalEmail.innerText = data.email
  })
}

function removeFromFavorite(id) {
  if (!userList || !userList.length) return

  //透過 id 找到要刪除好友的 index
  const userIndex = userList.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  //刪除該筆電影
  userList.splice(userIndex, 1)

  //存回 local storage
  localStorage.setItem('favoriteUsers', JSON.stringify(userList))

  //更新頁面
  renderUserList(userList)
}




dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-user')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


