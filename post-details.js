const postDetailContainer = document.getElementById('post-detail-container')
const queryParams = new URLSearchParams(window.location.search)
const postId = queryParams.get('id')

async function fetchPostDetails() {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${postId}.json`
    )
    const postData = await response.json()
    displayPostDetails(postData)

    if (postData.kids) {
      const commentsContainer = document.createElement('div')
      commentsContainer.id = 'comments-container'
      postDetailContainer.appendChild(commentsContainer)

      fetchComments(postData.kids, commentsContainer)
    }
  } catch (error) {
    console.error('Error fetching post details:', error)
  }
}

async function fetchComments(commentIds, container) {
  for (const id of commentIds) {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    )
    const commentData = await response.json()
    displayComment(commentData, container)
  }
}

function displayComment(commentData, container) {
  const commentElement = document.createElement('div')
  commentElement.classList.add('comment')
  commentElement.innerHTML = `
        <p class='themeText'><i class="ri-user-3-line pdd"></i>${commentData.by}</p>
        <p>${commentData.text}</p>
        <div class="replies"></div>
    `

  container.appendChild(commentElement)

  // If the comment has replies (kids), fetch them recursively
  if (commentData.kids) {
    const repliesContainer = commentElement.querySelector('.replies')
    fetchComments(commentData.kids, repliesContainer)
  }
}

function displayPostDetails(postData) {
  postDetailContainer.innerHTML = `
        <h1>${postData.title}</h1>
        <div class='flexBox'>
          <p class='pd'><i class="ri-user-3-line pdd"></i> ${postData.by}</p>
          <p class='pd'><i class="ri-star-smile-line pdd"></i>${postData.score}</p>
          <p class='pd'><i class="ri-calendar-line pdd"></i> ${new Date(
            postData.time * 1000
          ).toLocaleString()}</p>
          <a class='pd pa' href="${postData.url}" target="_blank"><i class="ri-links-line pdd"></i>Read full story</a>
        </div>
        <p class='postText'>${postData.text? postData.text : ''}</p>
        <h3>Comments:</h3>
    `
}

fetchPostDetails()
