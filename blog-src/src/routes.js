import AppComponent from './app';
import ListComponent from './pages/list';
import BlogComponent from './pages/blog';

const routes = [
  {
    path: '/',
    component: AppComponent,
    redirect: '/list'
  },
  {
    path: '/list',
    component: ListComponent
  },
  {
    name: 'blog',
    path: '/blog/:id',
    component: BlogComponent
  }
];

export default routes;
