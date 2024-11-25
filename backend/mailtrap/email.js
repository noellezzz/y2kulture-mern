export const generateOrderEmail = (orderItems, totalCost) => {
    const itemsHtml = orderItems.map(
      (item) => `
        <tr>
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
  export const emailDesign = `
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #dddddd;
        max-width: 600px;
      }
      h2 {
        color: #333333;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #dddddd;
      }
      th {
        background-color: #f2f2f2;
      }
      tfoot td {
        font-weight: bold;
      }
    </style>
  `;