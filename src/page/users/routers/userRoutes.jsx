import React from 'react';
import UserLayout from '../layouts/UserLayout';
import UserInfoLayout from '../layouts/UserInfoLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Home from '../pages/Home';
import CoursePage from '../pages/CoursePage';
import UserInfoPage from '../pages/UserInfoPage';
import CardPage from '../pages/CardPage';
import PaymentResult from '../pages/PaymenResult';
import AccessDeniedPage from '../pages/AccessDeniedPage';
import PurchasedCourses from '../pages/PurchasedCoursesPage';
import CourseDetail from '../pages/CourseDetail';
import DocList from '../pages/ContentList';

export const userRoutes = [
  {
    path: '/home',
    element: (
      <UserLayout>
        <Home />
      </UserLayout>
    ),
  },
  {
    path: '/document',
    element: (
      <UserLayout>
        <DocList />
      </UserLayout>
    ),
  },
  {
    path: '/course',
    element: (
      <UserLayout>
        <CoursePage />
      </UserLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <UserLayout>
        <LoginPage />
      </UserLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <UserLayout>
        <RegisterPage />
      </UserLayout>
    ),
  },
  {
    path: '/user/profile',
    element: (
      <UserLayout>
        <UserInfoLayout>
          <UserInfoPage/>
        </UserInfoLayout>
      </UserLayout>
    ),
  },
  {
    path: '/Course/:id/detail',
    element: (
      <UserLayout>
          <CourseDetail/>
      </UserLayout>
    ),
  },
  {
    path: '/user/purchased-courses',
    element: (
      <UserLayout>
        <UserInfoLayout>
          <PurchasedCourses/>
        </UserInfoLayout>
      </UserLayout>
    ),
  }  ,
  {
    path: '/user/orders',
    element: (
      <UserLayout>
        <UserInfoLayout>
          <UserInfoPage/>
        </UserInfoLayout>
      </UserLayout>
    ),
  } ,
  {
    path: '/user/settings',
    element: (
      <UserLayout>
        <UserInfoLayout>
          <UserInfoPage/>
        </UserInfoLayout>
      </UserLayout>
    ),
  },
  {
    path: '/cart',
    element: (
      <UserLayout>
        <CardPage/>
      </UserLayout>
    ),
  },
  {
    path: '/payment-result',
    element: (
      <UserLayout>
        <PaymentResult/>
      </UserLayout>
    ),
  },
  {
    path: '/access-denied',
    element: (
      <UserLayout>
        <AccessDeniedPage/>
      </UserLayout>
    ),
  }
];

export default userRoutes;