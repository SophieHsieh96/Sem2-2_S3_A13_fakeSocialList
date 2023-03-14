const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const userList = []
const dataPanel = document.querySelector('#data-panel')
const USERS_PER_PAGE = 20
let filteredUsers = []



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
          <button class="btn btn-danger btn-add-user" data-id="${user.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

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

function addToFavorite(id){
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const userFind = userList.find((user)=> user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此位好友已在收藏清單中！')
  }else{
    list.push(userFind)
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
    return alert('收藏成功!')
  }
  
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : userList
  //計算起始 index 
  const startIndex = (page - 1) * USERS_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  //製作 template 
  let rawHTML = ''
  
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}


axios
  .get(INDEX_URL)
  .then((response) => {
    userList.push(...response.data.results)
    renderPaginator(userList.length)
    renderUserList(getUsersByPage(1))
  })
  .catch((err) => console.log(err))



dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-add-user')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderUserList(getUsersByPage(page))
})


const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


searchForm.addEventListener('submit', function onSearchFormSubmitted(event)  {
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    if (!keyword.length) {
    return alert('請輸入有效字串！')
    }
    filteredUsers = userList.filter((user) => user.name.toLowerCase().includes(keyword)
    )
    if (!filteredUsers.length){
      return alert('查無相關好友!')
    }

    renderPaginator(filteredUsers.length)
    renderUserList(getUsersByPage(1))    
})