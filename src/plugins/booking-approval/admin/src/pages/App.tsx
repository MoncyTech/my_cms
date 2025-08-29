import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';
import BookingApprovalPage from './BookingApprovalPage';
import BookingDetailsPage from './BookingDetailsPage';

const App = () => {
  return (
    <Routes>
      <Route index element={<BookingApprovalPage />} />
      <Route path="bookings/:id" element={<BookingDetailsPage />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
