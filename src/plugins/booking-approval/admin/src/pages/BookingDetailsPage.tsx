// src/admin/pages/BookingDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Loader,
  Button,
  Grid,
  Field,
  Textarea,
  Dialog,
  Flex,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, put } = useFetchClient();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);

  const token =
    '9adf4b955e6194e8f20ec3d4296004aecfd492fadffa310de4d41486bd272ac103d00323fc3efa8dfdf9a5bcc9e4f89060901b81174da18601ffe964543608fdc07d1791a6bc6c19ddbff4967e6363c8d96e9b1578b5f74ac6e5ba0e3a8092b6727d8187b5b9415af4b72579ed7938c6767f3eb4b1df9b80ad392649ce68b41d'; // better to inject from config
  // fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await get(`/api/bookings/${id}?status=draft&populate=*`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data.data);
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const confirmAction = async () => {
    if (!selectedAction) return;
    try {
      // Call backend API
      // await post(`/api/bookings/${id}/${selectedAction}`, { message });
      await put(
        `/api/bookings/${id}`,
        {
          data: {
            booking_status: selectedAction === 'approve' ? 'accepted' : 'rejected',
            message,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },    
        }
      );

      console.log(`Booking ${selectedAction}`, { message });
      setIsModalOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  if (loading) return <Loader />;
  if (!booking) return <Typography>No booking found.</Typography>;

  return (
    <Box
      padding={8}
      background="neutral0"
      shadow="filterShadow"
      hasRadius
      maxWidth="850px"
      margin="0 auto"
    >
      {/* Header */}
      <Typography variant="alpha" fontWeight="bold" marginBottom={6}>
        Booking Request Approval
      </Typography>

      {/* Booking Details */}
      <Box marginBottom={6}>
        <Typography variant="delta" fontWeight="semibold" marginBottom={4}>
          Booking Details
        </Typography>

        <Grid.Root gap={4}>
          <Grid.Item col={6}>
            <Typography textColor="neutral600">
              Customer: <span className="text-gray-900 font-medium">{booking.customer_name}</span>
            </Typography>
          </Grid.Item>
          <Grid.Item col={6}>
            <Typography textColor="neutral600">
              Email: <span className="text-gray-900 font-medium">{booking.email}</span>
            </Typography>
          </Grid.Item>
          <Grid.Item col={6}>
            <Typography textColor="neutral600">
              Guests: <span className="text-gray-900 font-medium">{booking.guests}</span>
            </Typography>
          </Grid.Item>
          <Grid.Item col={6}>
            <Typography textColor="neutral600">
              Status: <span className="text-gray-900 font-medium">{booking.booking_status}</span>
            </Typography>
          </Grid.Item>
          <Grid.Item col={6}>
            <Typography textColor="neutral600">
              Start At:{' '}
              <span className="text-gray-900 font-medium">
                {new Date(booking.booking_startAt).toLocaleString()}
              </span>
            </Typography>
          </Grid.Item>
          <Grid.Item col={6}>
            <Typography textColor="neutral600">
              End At:{' '}
              <span className="text-gray-900 font-medium">
                {new Date(booking.booking_endAt).toLocaleString()}
              </span>
            </Typography>
          </Grid.Item>
          <Grid.Item col={12}>
            <Typography textColor="neutral600">
              Booking ID: <span className="text-gray-900 font-medium">{booking.booking_id}</span>
            </Typography>
          </Grid.Item>
        </Grid.Root>
      </Box>

      {/* Optional Message */}
      <Box marginBottom={6}>
        <Field.Root>
          <Field.Label>Message to Customer (Optional)</Field.Label>
          <Textarea
            placeholder="Enter approval or rejection message..."
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
            rows={4}
          />
        </Field.Root>
      </Box>

      {/* Action Buttons */}
      <Flex justifyContent="flex-end" gap={4}>
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedAction('reject');
            setIsModalOpen(true);
          }}
          style={{ background: '#f87171', color: 'white' }}
        >
          Reject
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedAction('approve');
            setIsModalOpen(true);
          }}
          style={{ background: '#4ade80', color: 'white' }}
        >
          Approve
        </Button>
      </Flex>

      {/* Confirmation Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content style={{ borderRadius: '16px', maxWidth: '500px' }}>
          <Dialog.Header>
            <Typography variant="beta" fontWeight="bold">
              Confirm {selectedAction === 'approve' ? 'Approval' : 'Rejection'}
            </Typography>
          </Dialog.Header>
          <Dialog.Body>
            <Typography>
              Are you sure you want to{' '}
              <strong>{selectedAction === 'approve' ? 'approve' : 'reject'}</strong> this booking?
            </Typography>
            {message && (
              <Box marginTop={4} padding={4} background="neutral100" hasRadius>
                <Typography textColor="neutral600">
                  Message: <span className="text-gray-900">{message}</span>
                </Typography>
              </Box>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Flex justifyContent="flex-end" gap={4} width="100%">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                style={{
                  background: selectedAction === 'approve' ? '#4ade80' : '#f87171',
                  color: 'white',
                }}
              >
                Confirm
              </Button>
            </Flex>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default BookingDetailsPage;
