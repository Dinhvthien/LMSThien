import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import ManageCourses from '../pages/ManageCourses';
import ManageUsers from '../pages/ManageUsers';
import CourseEdit from '../../admins/components/CourseEdit';
import CourseCreate from '../../admins/components/CourseCreate';
import ManageVideos from '../pages/ManageVideos';
import ManageDocuments from '../pages/ManageDocuments';
export const adminRoutes = [
  {
    path: '/admin/dashboard',
    element: (
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    ),
  },
  {
    path: '/admin/courses',
    element: (
      <AdminLayout>
        <ManageCourses />
      </AdminLayout>
    ),
  },
  {
    path: '/admin/video',
    element: (
      <AdminLayout>
        <ManageVideos />
      </AdminLayout>
    ),
  },
  
  {
    path: '/admin/document',
    element: (
      <AdminLayout>
        <ManageDocuments />
      </AdminLayout>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <AdminLayout>
        <ManageUsers />
      </AdminLayout>
    ),
  },
  {
    path: '/admin/course/:id/edit',
    element: (
      <AdminLayout>
        <CourseEdit />
      </AdminLayout>
    ),
  },
  {
    path: '/admin/course/add',
    element: (
      <AdminLayout>
        <CourseCreate />
      </AdminLayout>
    ),
  },
];

export default adminRoutes;