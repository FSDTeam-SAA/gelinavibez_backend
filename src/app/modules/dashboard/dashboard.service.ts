import Apartment from '../apartment/apartment.model';
import { Payment } from '../payment/payment.model';
import Service from '../service/service.model';
import Tenant from '../tenant/tenant.model';
import User from '../user/user.model';

const dashboardViewCount = async () => {
  const [apartment, service, user, booking] = await Promise.all([
    Apartment.countDocuments(),
    Service.countDocuments(),
    User.countDocuments(),
    Tenant.countDocuments(),
  ]);

  const totalEarningResult = await Payment.aggregate([
    {
      $match: { status: 'approved' },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const totalEarning = totalEarningResult[0]?.total || 0;

  return { apartment, service, counstomer: user, booking, totalEarning };
};

export const dashboardService = {
  dashboardViewCount,
};
