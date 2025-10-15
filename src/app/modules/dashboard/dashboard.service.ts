import Apartment from '../apartment/apartment.model';
import Service from '../service/service.model';
import Tenant from '../tenant/tenant.model';
import User from '../user/user.model';

const dashboardViewCount = async () => {
  const apartment = await Apartment.countDocuments();
  const service = await Service.countDocuments();
  const user = await User.countDocuments();
  const booking = await Tenant.countDocuments();
  const totalErning = await Tenant.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);
  const totalErningAmount = totalErning[0]?.total || 0;
  return { apartment, service, user, booking, totalErningAmount };
};

export const dashboardController = {
  dashboardViewCount,
};
