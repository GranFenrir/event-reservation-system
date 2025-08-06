import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { paymentService } from '../services/microservices';

interface Payment {
  id: string;
  reservationId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: {
    type: 'card' | 'bank_transfer' | 'paypal';
    last4?: string;
    brand?: string;
  };
  stripePaymentIntentId?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  reservation: {
    id: string;
    event: {
      title: string;
      startDate: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  refunds?: Array<{
    id: string;
    amount: number;
    reason: string;
    createdAt: string;
  }>;
}

const StatusBadge: React.FC<{ status: Payment['status'] }> = ({ status }) => {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return <Clock size={12} />;
      case 'processing': return <RefreshCw size={12} className="animate-spin" />;
      case 'completed': return <CheckCircle size={12} />;
      case 'failed': return <AlertCircle size={12} />;
      case 'cancelled': return <AlertCircle size={12} />;
      case 'refunded': return <RotateCcw size={12} />;
      default: return null;
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span className="ml-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </span>
  );
};

const PaymentMethodBadge: React.FC<{ paymentMethod: Payment['paymentMethod'] }> = ({ paymentMethod }) => {
  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard size={12} />;
      default: return <DollarSign size={12} />;
    }
  };

  const getMethodText = (method: Payment['paymentMethod']) => {
    if (method.type === 'card' && method.brand && method.last4) {
      return `${method.brand.toUpperCase()} •••• ${method.last4}`;
    }
    return method.type.replace('_', ' ').toUpperCase();
  };

  return (
    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
      {getMethodIcon(paymentMethod.type)}
      <span className="ml-1">{getMethodText(paymentMethod)}</span>
    </span>
  );
};

const PaymentCard: React.FC<{
  payment: Payment;
  onView: (payment: Payment) => void;
  onRefund: (payment: Payment) => void;
}> = ({ payment, onView, onRefund }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amounts are in cents
  };

  const totalRefunded = payment.refunds?.reduce((sum, refund) => sum + refund.amount, 0) || 0;
  const remainingAmount = payment.amount - totalRefunded;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {formatAmount(payment.amount, payment.currency)}
          </h3>
          <p className="text-sm text-gray-600">
            Payment #{payment.id.slice(0, 8)}
          </p>
        </div>
        <StatusBadge status={payment.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User size={16} className="mr-2 text-gray-400" />
          <span>{payment.user.name} ({payment.user.email})</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>{payment.reservation.event.title}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-2 text-gray-400" />
          <span>{formatDate(payment.createdAt)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <PaymentMethodBadge paymentMethod={payment.paymentMethod} />
      </div>

      {/* Refund Information */}
      {payment.refunds && payment.refunds.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800 mb-2">
            Refunds ({payment.refunds.length})
          </h4>
          <div className="space-y-1">
            {payment.refunds.map((refund) => (
              <div key={refund.id} className="text-xs text-purple-700">
                {formatAmount(refund.amount, payment.currency)} - {refund.reason}
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-purple-200">
            <span className="text-sm font-medium text-purple-800">
              Remaining: {formatAmount(remainingAmount, payment.currency)}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {payment.stripePaymentIntentId ? 'Stripe' : 'Internal'}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(payment)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {payment.status === 'completed' && remainingAmount > 0 && (
            <button
              onClick={() => onRefund(payment)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
              title="Process Refund"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await paymentService.getPayments(params);
      
      setPayments(response.data || response);
      setTotalPayments(response.total || response.length);
    } catch (err) {
      setError('Failed to fetch payments');
      console.error('Payments fetch error:', err);
      
      // Mock data for development
      const mockPayments: Payment[] = [
        {
          id: '1',
          reservationId: 'res1',
          userId: 'user1',
          amount: 15000, // $150.00 in cents
          currency: 'usd',
          status: 'completed',
          paymentMethod: {
            type: 'card',
            last4: '4242',
            brand: 'visa',
          },
          stripePaymentIntentId: 'pi_test_123',
          user: {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
          },
          reservation: {
            id: 'res1',
            event: {
              title: 'Summer Music Festival',
              startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          reservationId: 'res2',
          userId: 'user2',
          amount: 20000, // $200.00 in cents
          currency: 'usd',
          status: 'refunded',
          paymentMethod: {
            type: 'card',
            last4: '1234',
            brand: 'mastercard',
          },
          user: {
            id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
          reservation: {
            id: 'res2',
            event: {
              title: 'Tech Conference 2025',
              startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          refunds: [
            {
              id: 'ref1',
              amount: 20000,
              reason: 'Event cancelled',
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          reservationId: 'res3',
          userId: 'user3',
          amount: 8000, // $80.00 in cents
          currency: 'usd',
          status: 'pending',
          paymentMethod: {
            type: 'card',
          },
          user: {
            id: 'user3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
          },
          reservation: {
            id: 'res3',
            event: {
              title: 'Basketball Championship',
              startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setPayments(mockPayments);
      setTotalPayments(mockPayments.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchTerm, statusFilter]);

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    console.log('View payment:', payment);
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowRefundModal(true);
    const totalRefunded = payment.refunds?.reduce((sum, refund) => sum + refund.amount, 0) || 0;
    const remainingAmount = payment.amount - totalRefunded;
    setRefundAmount((remainingAmount / 100).toString());
  };

  const processRefund = async () => {
    if (!selectedPayment || !refundAmount || !refundReason) return;

    try {
      const amount = parseFloat(refundAmount) * 100; // Convert to cents
      await paymentService.processRefund(selectedPayment.id, amount, refundReason);
      setShowRefundModal(false);
      setRefundAmount('');
      setRefundReason('');
      setSelectedPayment(null);
      fetchPayments();
    } catch (err) {
      console.error('Refund error:', err);
      alert('Failed to process refund');
    }
  };

  const statuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
          <div className="text-sm text-gray-600">
            Total: {totalPayments} payments
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RotateCcw className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refunded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'refunded').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user, payment ID, or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchPayments}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
              >
                <Filter size={16} className="mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Payments Grid */}
        {error && !payments.length ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 mb-4">Showing mock data for development</p>
            <button
              onClick={fetchPayments}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {payments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onView={handleView}
                  onRefund={handleRefund}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPayments > 12 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-gray-600">
                    Page {currentPage} of {Math.ceil(totalPayments / 12)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalPayments / 12)}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Refund Modal */}
        {showRefundModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Process Refund
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter refund reason..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundAmount('');
                    setRefundReason('');
                    setSelectedPayment(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={processRefund}
                  disabled={!refundAmount || !refundReason}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PaymentList = () => <div>Payment List</div>;
export const PaymentShow = () => <div>Payment Show</div>;
