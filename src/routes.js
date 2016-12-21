import blogList from './components/blogList'
import blog from './components/blog'

const routes = [
  {
    name: 'root',
    path: '/',
    redirect: '/blogs'
  },
  {
    name: 'blogs',
    path: '/blogs',
    component: blogList
  },
  {
    name: 'blog',
    path: '/blog/:id',
    component: blog
  }
]

export default routes
