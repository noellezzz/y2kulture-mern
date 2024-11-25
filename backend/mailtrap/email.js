export const generateOrderEmail = (orderItems, totalCost) => {
    const itemsHtml = orderItems.map(
      (item) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.productName}</td>
          <td>${item.price}</td>
          <td>${item.quantity}</td>
          <td>${item.price * item.quantity}</td>
        </tr>`
    ).join('');
  
    return `
      <h2>Thank you for your order!</h2>
      <p>Here are the details of your purchase:</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Product</th>
            <th>Product test</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total:</td>
            <td>${totalCost}</td>
          </tr>
        </tfoot>
      </table>
    `;
  };
  