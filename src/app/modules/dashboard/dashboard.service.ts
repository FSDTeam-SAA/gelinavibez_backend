import Apartment from '../apartment/apartment.model';
import Service from '../service/service.model';
import Tenant from '../tenant/tenant.model';
import User from '../user/user.model';

const dashboardViewCount = async () => {
  // const apartment = await Apartment.countDocuments();
  // const service = await Service.countDocuments();
  // const user = await User.countDocuments();
  // const booking = await Tenant.countDocuments();
  // const totalErning = await Tenant.aggregate([
  //   {
  //     $group: {
  //       _id: null,
  //       total: { $sum: '$amount' },
  //     },
  //   },
  // ]);
  // const totalErningAmount = totalErning[0]?.total || 0;
  const [apartment, service, user, booking] = await Promise.all([
    Apartment.countDocuments(),
    Service.countDocuments(),
    User.countDocuments(),
    Tenant.countDocuments(),
  ]);

  // মোট আয় (earning)
  const totalEarningResult = await Tenant.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const totalEarning = totalEarningResult[0]?.total || 0;
  const totalErningAmount = totalEarning;
  return { apartment, service, user, booking, totalErningAmount };
};

export const dashboardController = {
  dashboardViewCount,
};
