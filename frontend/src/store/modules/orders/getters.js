export default {
    orderHasAccount: state => state.orderHasAccount,
    ordersStatistic: state => state.ordersStatistic || {},
    ordersTables: state => state.orders,
    currentOrder: state => state.currentOrder,
    currentTicket: state => state.currentTicket,
    currentPark: state => state.currentPark,
    myOrders: state => state.myOrders || []
};
