document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('posts-container')
  
    let currentPage = 1
    const postsPerPage = 20
    let allPosts = []
  
    async function fetchPosts() {
      try {
        const response = await fetch(
          'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&limit=500'
        )
        const postIds = await response.json()
        allPosts = postIds.slice(0, 500) // Store all posts
  
        displayPage(currentPage)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
  
    function displayPage(page) {
      postsContainer.innerHTML = '' // Clear current posts
      const start = (page - 1) * postsPerPage
      const end = start + postsPerPage
      const totalPages = Math.ceil(allPosts.length / postsPerPage)
  
      allPosts.slice(start, end).forEach(async (id) => {
        const postResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        )
        const postData = await postResponse.json()
        displayPost(postData)
      })
      updatePageInfo(page, totalPages)
    }
  
    function displayPost(postData) {
      const postElement = document.createElement('div')
      postElement.className = 'eachPost'
      postElement.innerHTML = `
          <div id="postTitle">${postData.title}</div>
          <div id="postDetails">
              <div class="stars pd"><i class="ri-star-smile-line pdd"></i>${
                postData.score ? postData.score : 0
              }</div>
              <div class="comments pd"><i class="ri-message-3-line pdd"></i>${
                postData.descendants ? postData.descendants : 0
              }</div>
              <div class="author pd"><i class="ri-user-3-line pdd"></i>${
                postData.by
              }</div>
          </div>
      `
      postElement.style.cursor = 'pointer'
      postElement.onclick = () => {
        window.location.href = `post-details.html?id=${postData.id}`
      }
      postsContainer.appendChild(postElement)
    }
  
    document.getElementById('prev-page').onclick = function prevPage() {
      if (currentPage > 1) {
        currentPage--
        displayPage(currentPage)
      }
    }
  
    document.getElementById('next-page').onclick = function nextPage() {
      if (currentPage * postsPerPage < allPosts.length) {
        currentPage++
        displayPage(currentPage)
      }
    }
  
    fetchPosts()
  })
  
  function updatePageInfo(currentPage, totalPages) {
    const pageInfoElement = document.getElementById('page-info')
    pageInfoElement.textContent = `${currentPage}/${totalPages}`
  }
  