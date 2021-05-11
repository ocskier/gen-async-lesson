// A class for interacting with our https://dummyapi.io/ data
class API {
  constructor() {
    this._url = 'https://dummyapi.io/data/api/post?limit=5'; // post endpoint limit 5
    this._app_id = '608ff65ecfb4e068c46f3038'; // had to signup for an app id key
    this._options = {
      headers: { 'app-id': this._app_id }, //// We have to add the credentials to the headers of the request
    };
    this._posts = []; // db store property for our posts
  }
  // getters for our properties
  get url() {
    return this._url;
  }
  get options() {
    return this._options;
  }
  get posts() {
    return this._posts;
  }

  // a method for prepopulating a snapshot of posts
  // using fetch to return some post test data
  // https://www.sitepoint.com/introduction-to-the-fetch-api/
  // https://developers.google.com/web/updates/2015/03/introduction-to-fetch

  async getInitialPosts() {
    // code goes here
    try {
      const response = await fetch(this.url, this.options);
      const jsonData = await response.json();
      console.log('Retrieved posts from API');
      this._posts = jsonData.data;
    } catch (error) {
      console.log('Error' + error);
    }
  }

  getPosts() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.posts
          ? resolve(this.posts)
          : reject(new Error(`Couldn't retrieve post data!`));
      }, 1000);
    });
  }

  addPost(post) {
    return new Promise((resolve, reject) => {

      this._posts.push(post);

      console.log('Post was created!');
      setTimeout(() => {
        post
          ? resolve(post)
          : reject(new Error(`Error: something went wrong!`));
      }, 500);
    });
  }

  deletePost() {
    return new Promise((resolve, reject) => {
      //This is removing the last post from the post array
      const deletedPost = this._posts.pop();
      console.log('Last Post was deleted!');
      setTimeout(() => {
        deletedPost
          ? resolve(deletedPost)
          : reject(new Error(`Error: something went wrong while deleting!`));

      }, 500);
    });
  }
}

const api = new API();

const start = async () => {
  try {
    await api.getInitialPosts();
    let posts = await api.getPosts();
    console.log('----------------------');
    posts.forEach(post => {
      printPostRow(post);
      console.log('----------------------');
    });
    console.log('----------------------');
  } catch (error) {
    console.log('Error while getting posts' + error);
  }
};
//await here api.addPost() need to add async in the function name
const addANewPost = async () => {
  try {
    const firstInput = prompt('What is your first name?').trim();
    const lastInput = prompt('What is your last name?').trim();
    const postInput = prompt('What would you like to post?').trim();
    if (firstInput && lastInput && postInput) {

      let newPost = {
        owner: {
          firstName: firstInput,
          lastName: lastInput,
        },
        text: postInput,
      };
      api.addPost(newPost);
      //this is correct idea. re-print after the promise is fulfilled using await keyword
      let posts = await api.getPosts();
      console.log('----------------------');
      posts.forEach(post => {
        printPostRow(post);
        console.log('----------------------');
      });
      console.log('----------------------');
    }
  } catch (error) {
    console.log('Error while getting posts' + error);
  }
};

const deleteAPost = async () => {

  // code goes here
  const deletedPost = await api.deletePost();
  let posts = await api.getPosts();
  console.log('----------------------');
  posts.forEach(post => {
    printPostRow(post);
    console.log('----------------------');
  });
  console.log('----------------------');
};


// This is a utility function to print individual posts to the console
const printPostRow = (post) => {
  console.log(`Left By: ${post.owner.firstName} ${post.owner.lastName}`);
  console.log(`Message: ${post.text}`);
};

// Don't worry about the statements below, we will go more into how these work on Monday
// These trigger the functions when the button is clicked in the HTML
document
  .querySelector('span:nth-child(1)')
  .addEventListener('click', addANewPost);
document
  .querySelector('span:nth-child(2)')
  .addEventListener('click', deleteAPost);

// starting our app
start();
