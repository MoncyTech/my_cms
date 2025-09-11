import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Dialog,
  Flex,
  IconButton,
} from '@strapi/design-system';
import {
  useFetchClient,
  useNotification,
  useAPIErrorHandler,
  useStrapiApp,
} from '@strapi/strapi/admin';
import { Textarea } from '@strapi/design-system';
import { Field } from '@strapi/design-system';
import { Grid } from '@strapi/design-system';
import { SingleSelect } from '@strapi/design-system';
import { SingleSelectOption } from '@strapi/design-system';
import { Searchbar } from '@strapi/design-system';
import { ArrowDown, ArrowUp } from '@strapi/icons';
import { TextInput } from '@strapi/design-system';
const STRAPI_API_KEY =
  '9f0685ea624f8991398e57683f462523346fe80116510116937c402b161eba6fa8c310ea9da0b9abf2bda5477947319ae95fee8404c4a1f494546cff82cfc1c1c70cc2a7043f44e70d04f9c9039c69641c0286bfd0967641fb15c9fb4493aef6223e372414225cdd91914e0671b4a6026894e3e403269750e6073efe08499bef';
interface Booking {
  documentId: any;
  id: number;
  customer: string;
  date: string;
  guests: number;
  status: 'pending' | 'accepted' | 'rejected';
  email?: string;
  booking_id?: string;
  endDate?: string;
  createdAt?: string;
}

const BookingApprovalPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [message, setMessage] = useState('');

  const { get, put } = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  // Cast to any to bypass TypeScript checking
  const token = STRAPI_API_KEY;
  // Fetch bookings

  const getConfig = async () => {
    const response = await get('/booking-approval/config');
    console.log(response);
  };
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await get('/api/bookings?status=draft&populate=*', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formatted = response.data.data.map((b: any) => ({
        id: b.id,
        documentId: b.documentId,
        customer: b.customer_name,
        date: b.booking_startAt,
        guests: b.guests,
        status: b.booking_status,
        email: b.email,
        booking_id: b.booking_id,
        endDate: b.booking_endAt,
        createdAt: b.createdAt,
        message: b.message,
      }));

      console.log('Fetched bookings:', formatted);
      setBookings(formatted);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      toggleNotification({
        type: 'warning',
        message: formatAPIError(err),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter and sort bookings
  useEffect(() => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.booking_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Booking];
      let bValue: any = b[sortBy as keyof Booking];

      // Handle date sorting
      if (sortBy === 'date' || sortBy === 'createdAt' || sortBy === 'endDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      // Handle undefined values
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    console.log({ filtered });
    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, sortBy, sortOrder]);

  // Handle booking action (approve/reject)
  const handleBookingAction = async (action: 'approve' | 'reject' | null = null) => {
    console.log({ action });
    let actionType_1 = actionType;
    if (action) {
      actionType_1 = action;
    }
    if (!selectedBooking || !actionType_1) return;
    try {
      const newStatus = actionType_1 === 'approve' ? 'accepted' : 'rejected';
      await put(
        `/api/bookings/${selectedBooking.documentId}`,
        {
          data: {
            booking_status: newStatus,
            message,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toggleNotification({
        type: 'success',
        message: `Booking ${actionType_1}d successfully!`,
      });

      // Update local state
      setBookings((prev: any) =>
        prev.map((booking: any) =>
          booking.id === selectedBooking.id ? { ...booking, status: newStatus } : booking
        )
      );

      // Close modal and reset
      setIsModalOpen(false);
      setSelectedBooking(null);
      setActionType(null);
      setMessage('');
    } catch (err: any) {
      console.error('❌ Error updating booking:', err);
      toggleNotification({
        type: 'warning',
        message: formatAPIError(err),
      });
    }
  };

  // Open action modal
  const openActionModal = (booking: Booking, action: 'approve' | 'reject') => {
    setSelectedBooking(booking);
    setActionType(action);
    setIsModalOpen(true);
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Format date for display in table
  const formatTableDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      <Box>
        <Typography variant="pi" fontWeight="bold">
          {date.toLocaleDateString()}
        </Typography>
        <Typography variant="pi" textColor="neutral600">
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>
    );
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <Box padding={8} background="neutral0">
      <Typography variant="alpha" marginBottom={10}>
        Booking Approval Dashboard
      </Typography>

      {/* Filters and Search */}
      <Box marginBottom={6} marginTop={6}>
        <Grid.Root gap={4} columns={4} alignItems="center">
          <Grid.Item col={4}>
            <Flex gap={4} align="center">
              <TextInput
                onClear={() => setSearchTerm('')}
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                placeholder="Search by customer, email, or booking ID..."
                style={{ flex: 1 }}
              />

              <SingleSelect label="Filter" value={statusFilter} onChange={setStatusFilter}>
                <SingleSelectOption value="all">All</SingleSelectOption>
                <SingleSelectOption value="pending">Pending</SingleSelectOption>
                <SingleSelectOption value="accepted">Accepted</SingleSelectOption>
                <SingleSelectOption value="rejected">Rejected</SingleSelectOption>
              </SingleSelect>

              <SingleSelect label="Sort by" value={sortBy} onChange={setSortBy}>
                <SingleSelectOption value="date">Booking Date</SingleSelectOption>
                <SingleSelectOption value="createdAt">Created Date</SingleSelectOption>
                <SingleSelectOption value="customer">Customer</SingleSelectOption>
                <SingleSelectOption value="status">Status</SingleSelectOption>
              </SingleSelect>

              <SingleSelect
                label="Order"
                value={sortOrder}
                onChange={(value: string) => setSortOrder(value as 'asc' | 'desc')}
              >
                <SingleSelectOption value="desc">Newest First</SingleSelectOption>
                <SingleSelectOption value="asc">Oldest First</SingleSelectOption>
              </SingleSelect>
            </Flex>
          </Grid.Item>
        </Grid.Root>
      </Box>

      {/* Bookings Table */}
      {loading ? (
        <Box textAlign="center" padding={8}>
          <Typography>Loading bookings...</Typography>
        </Box>
      ) : (
        <Table colCount={6} rowCount={filteredBookings.length}>
          <Thead>
            <Tr>
              <Th>
                <Button variant="tertiary" onClick={() => handleSort('customer')}>
                  Customer{' '}
                  {sortBy === 'customer' && (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
                </Button>
              </Th>
              <Th>
                <Button variant="tertiary" onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
                </Button>
              </Th>
              <Th>
                <Button variant="tertiary" onClick={() => handleSort('date')}>
                  Booking Date{' '}
                  {sortBy === 'date' && (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
                </Button>
              </Th>
              <Th>
                <Button variant="tertiary" onClick={() => handleSort('status')}>
                  Status{' '}
                  {sortBy === 'status' && (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
                </Button>
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredBookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>
                  <Box>
                    <Typography fontWeight="bold">{booking.customer}</Typography>
                    {booking.booking_id && (
                      <Typography variant="pi" textColor="neutral600">
                        ID: {booking.booking_id}
                      </Typography>
                    )}
                  </Box>
                </Td>
                <Td>{booking.email || 'N/A'}</Td>
                <Td>
                  {formatTableDate(booking.date)}
                  {booking.endDate && (
                    <Typography variant="pi" textColor="neutral600">
                      to {formatTableDate(booking.endDate)}
                    </Typography>
                  )}
                </Td>
                <Td>
                  <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                </Td>
                <Td>
                  <Flex gap={2}>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="S"
                          onClick={() => openActionModal(booking, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="S"
                          onClick={() => openActionModal(booking, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setActionType(null);
                        setIsModalOpen(true);
                      }}
                      variant="tertiary"
                      size="S"
                    >
                      View
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {filteredBookings.length === 0 && !loading && (
        <Box textAlign="center" padding={8}>
          <Typography>No bookings found matching your criteria</Typography>
        </Box>
      )}

      {/* Action Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content className="rounded-2xl shadow-lg p-6 max-w-lg w-full bg-white">
          {/* Header */}
          <Dialog.Header>
            <Typography variant="beta" fontWeight="bold" className="text-gray-900">
              {actionType === 'approve'
                ? 'Approve Booking'
                : actionType === 'reject'
                  ? 'Reject Booking'
                  : 'Booking Details'}
            </Typography>
          </Dialog.Header>

          {/* Body */}
          <Dialog.Body>
            <Box className="space-y-6">
              {selectedBooking && (
                <Box>
                  <Typography
                    variant="delta"
                    fontWeight="semibold"
                    className="border-b pb-2 mb-4 text-gray-800"
                  >
                    Booking Details
                  </Typography>

                  <Grid.Root gap={4}>
                    {/* Customer Info */}
                    <Grid.Item xs={12}>
                      <Typography className="text-gray-600">
                        Customer:{' '}
                        <span className="text-gray-900 font-medium">
                          {selectedBooking.customer}
                        </span>
                      </Typography>
                    </Grid.Item>

                    <Grid.Item xs={12}>
                      <Typography className="text-gray-600">
                        Email:{' '}
                        <span className="text-gray-900 font-medium">
                          {selectedBooking.email || 'N/A'}
                        </span>
                      </Typography>
                    </Grid.Item>

                    {/* Booking Info */}
                    <Grid.Item xs={6}>
                      <Typography className="text-gray-600">
                        Guests:{' '}
                        <span className="text-gray-900 font-medium">{selectedBooking.guests}</span>
                      </Typography>
                    </Grid.Item>

                    <Grid.Item xs={6}>
                      <Typography className="text-gray-600">
                        Date:{' '}
                        <span className="text-gray-900 font-medium">
                          {formatDate(selectedBooking.date)}
                        </span>
                      </Typography>
                    </Grid.Item>

                    {selectedBooking.endDate && (
                      <Grid.Item xs={12}>
                        <Typography className="text-gray-600">
                          End Date:{' '}
                          <span className="text-gray-900 font-medium">
                            {formatDate(selectedBooking.endDate)}
                          </span>
                        </Typography>
                      </Grid.Item>
                    )}

                    {selectedBooking.booking_id && (
                      <Grid.Item xs={12}>
                        <Typography className="text-gray-600">
                          Booking ID:{' '}
                          <span className="text-gray-900 font-medium">
                            {selectedBooking.booking_id}
                          </span>
                        </Typography>
                      </Grid.Item>
                    )}
                  </Grid.Root>
                </Box>
              )}

              {/* Optional message field */}
              {(actionType === 'approve' || actionType === 'reject') && (
                <Field.Root width="100%">
                  <Field.Label className="mb-2 font-medium text-gray-700">
                    Message to Customer (Optional):
                  </Field.Label>
                  <Textarea
                    placeholder={`Enter a ${
                      actionType === 'approve' ? 'confirmation' : 'rejection'
                    } message for the customer...`}
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setMessage(e.target.value)
                    }
                    className="rounded-lg shadow-sm border border-gray-300 text-gray-900 focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                    rows={4}
                  />
                </Field.Root>
              )}
            </Box>
          </Dialog.Body>

          {/* Footer */}
          <Dialog.Footer className="flex justify-between gap-3 mt-6">
            {/* Left side: Show Approve/Reject if pending */}
            {selectedBooking?.status === 'pending' && (
              <Flex gap={2}>
                <Button
                  variant="success"
                  size="S"
                  onClick={() => {
                    setActionType('approve');
                    handleBookingAction();
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="S"
                  onClick={() => {
                    setActionType('reject');
                    handleBookingAction();
                  }}
                >
                  Reject
                </Button>
              </Flex>
            )}

            <Dialog.Cancel>
              <Button variant="tertiary" className="rounded-lg px-4">
                Close
              </Button>
            </Dialog.Cancel>
            {/* Right side: Cancel / Confirm (for approve/reject flow) */}
            {selectedBooking?.status !== 'pending' && (
              <Flex gap={2}>
                {
                  <Dialog.Action>
                    <Button
                      variant={selectedBooking?.status === 'rejected' ? 'success' : 'danger'}
                      onClick={() => {
                        if (selectedBooking?.status === 'rejected') {
                          handleBookingAction('approve');
                        } else {
                          handleBookingAction('reject');
                        }
                      }}
                      className="rounded-lg px-4 font-medium"
                    >
                      Change to {selectedBooking?.status === 'rejected' ? 'Approval' : 'Rejection'}
                    </Button>
                  </Dialog.Action>
                }
              </Flex>
            )}
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default BookingApprovalPage;
