import blogList from './components/blogList'

const routes = [
  {
    path: '/',
    redirect: '/blogs'
  },
  {
    path: '/blogs',
    component: blogList
  }
]

export default routes
